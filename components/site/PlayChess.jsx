'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { FiRotateCcw, FiCornerUpLeft, FiCpu, FiUser } from 'react-icons/fi';
import { bestMove } from '@/lib/chess-engine';

/* Depth 1 ≈ 15ms, depth 2 ≈ 0.1–0.5s, depth 3 ≈ 1–3.5s — hence the worker. */
const LEVELS = [
  { id: 'easy', label: 'Easy', depth: 1 },
  { id: 'normal', label: 'Normal', depth: 2 },
  { id: 'hard', label: 'Hard', depth: 3 },
];

const START_FEN = new Chess().fen();

export default function PlayChess() {
  // gameRef is the mutable source of truth for MOVES; `fen` mirrors it for
  // rendering. Render-time reads go through `game` (derived from fen) so the
  // UI never depends on reading a ref mid-render.
  const gameRef = useRef(null);
  if (gameRef.current === null) gameRef.current = new Chess();
  const workerRef = useRef(null);
  const reqRef = useRef(0);
  const [fen, setFen] = useState(START_FEN);
  const [level, setLevel] = useState('normal');
  const [thinking, setThinking] = useState(false);
  const [history, setHistory] = useState([]);
  // Click-to-move: first click selects, second click moves. Works on touch.
  const [selected, setSelected] = useState(null);

  const depth = LEVELS.find((l) => l.id === level).depth;
  const game = useMemo(() => new Chess(fen), [fen]);

  const sync = useCallback(() => {
    setFen(gameRef.current.fen());
    setHistory(gameRef.current.history());
  }, []);

  const applyEngineMove = useCallback(
    (move) => {
      const g = gameRef.current;
      if (move && !g.isGameOver()) {
        try {
          g.move(move);
        } catch {
          /* Position moved on beneath us (undo/reset) — drop the stale reply. */
        }
      }
      sync();
      setThinking(false);
    },
    [sync]
  );

  // Spin up the search worker once. Falls back to the main thread if the
  // browser (or the bundler in some dev setups) can't give us one.
  useEffect(() => {
    let w;
    try {
      w = new Worker(new URL('./chess.worker.js', import.meta.url));
      w.onmessage = (e) => {
        // Ignore replies for superseded positions.
        if (e.data.id !== reqRef.current) return;
        applyEngineMove(e.data.move);
      };
      workerRef.current = w;
    } catch {
      workerRef.current = null;
    }
    return () => {
      workerRef.current = null;
      w?.terminate();
    };
  }, [applyEngineMove]);

  const requestEngineMove = useCallback(() => {
    const g = gameRef.current;
    if (g.isGameOver()) return;
    setThinking(true);
    const id = reqRef.current + 1;
    reqRef.current = id;

    const w = workerRef.current;
    if (w) {
      w.postMessage({ fen: g.fen(), depth, id });
      return;
    }
    // No worker: yield one frame so the player's move paints, then search.
    setTimeout(() => {
      if (reqRef.current !== id) return;
      applyEngineMove(bestMove(gameRef.current.fen(), depth));
    }, 30);
  }, [depth, applyEngineMove]);

  /* Single place that validates and plays a white move, used by both
     drag-and-drop and click-to-move. */
  const tryMove = useCallback(
    (from, to) => {
      if (!from || !to || thinking) return false;
      const g = gameRef.current;
      if (g.turn() !== 'w' || g.isGameOver()) return false;
      try {
        g.move({ from, to, promotion: 'q' });
      } catch {
        return false; // illegal move
      }
      setSelected(null);
      sync();
      requestEngineMove();
      return true;
    },
    [requestEngineMove, sync, thinking]
  );

  const onPieceDrop = useCallback(
    ({ sourceSquare, targetSquare }) => tryMove(sourceSquare, targetSquare),
    [tryMove]
  );

  const onSquareClick = useCallback(
    ({ square }) => {
      const g = gameRef.current;
      if (thinking || g.turn() !== 'w' || g.isGameOver()) return;

      if (selected) {
        if (square === selected) {
          setSelected(null);
          return;
        }
        // If the move is illegal, treat the click as a new selection instead.
        if (tryMove(selected, square)) return;
      }
      const piece = g.get(square);
      setSelected(piece && piece.color === 'w' ? square : null);
    },
    [selected, thinking, tryMove]
  );

  const reset = () => {
    reqRef.current += 1; // invalidate any in-flight search
    gameRef.current = new Chess();
    setSelected(null);
    setThinking(false);
    sync();
  };

  const undo = () => {
    reqRef.current += 1;
    const g = gameRef.current;
    g.undo(); // engine reply
    g.undo(); // your move
    setSelected(null);
    setThinking(false);
    sync();
  };

  const status = useMemo(() => {
    if (game.isCheckmate()) return game.turn() === 'w' ? 'Checkmate — I win.' : 'Checkmate — you win. Well played.';
    if (game.isDraw()) return 'Draw.';
    if (game.isCheck()) return game.turn() === 'w' ? 'You are in check.' : 'I am in check.';
    return game.turn() === 'w' ? 'Your move (white).' : 'My move…';
  }, [game]);

  /* Highlight the selected square and every square it can legally reach. */
  const squareStyles = useMemo(() => {
    if (!selected) return {};
    const styles = {
      [selected]: { boxShadow: 'inset 0 0 0 3px var(--c-accent)' },
    };
    for (const m of game.moves({ square: selected, verbose: true })) {
      styles[m.to] = {
        background: m.captured
          ? 'radial-gradient(circle, transparent 55%, var(--c-accent) 58%, var(--c-accent) 70%, transparent 73%)'
          : 'radial-gradient(circle, var(--c-accent) 0 22%, transparent 24%)',
      };
    }
    return styles;
  }, [selected, game]);

  const options = useMemo(
    () => ({
      position: fen,
      onPieceDrop,
      onSquareClick,
      squareStyles,
      allowDragging: !thinking && game.turn() === 'w' && !game.isGameOver(),
      boardOrientation: 'white',
      darkSquareStyle: { backgroundColor: 'var(--c-accent-soft)' },
      lightSquareStyle: { backgroundColor: 'var(--c-bg-2)' },
      boardStyle: { borderRadius: '4px', overflow: 'hidden' },
      id: 'play-with-me',
    }),
    [fen, onPieceDrop, onSquareClick, squareStyles, thinking, game]
  );

  // Pair the flat move list into numbered rows.
  const rows = [];
  for (let i = 0; i < history.length; i += 2) {
    rows.push({ n: i / 2 + 1, w: history[i], b: history[i + 1] });
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
      <div>
        <div className="mx-auto w-full max-w-[560px]">
          <Chessboard options={options} />
        </div>
        <p className="mt-5 text-center text-sm text-ink-muted">{thinking ? 'Thinking…' : status}</p>
      </div>

      <aside className="flex flex-col gap-6">
        <div className="card p-5">
          <p className="eyebrow mb-3">Difficulty</p>
          <div className="flex gap-2">
            {LEVELS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLevel(l.id)}
                className={`flex-1 rounded border px-3 py-2 text-xs font-semibold tracking-wider uppercase transition-colors ${
                  level === l.id
                    ? 'border-accent bg-accent text-accent-ink'
                    : 'border-line text-ink-muted hover:border-line-strong hover:text-ink'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-ink-faint">
            <span className="inline-flex items-center gap-1.5">
              <FiUser size={12} /> You — white
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FiCpu size={12} /> Me — black
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={reset} className="btn-ghost flex-1 justify-center">
            <FiRotateCcw size={13} /> New Game
          </button>
          <button
            type="button"
            onClick={undo}
            disabled={history.length < 2}
            className="btn-ghost flex-1 justify-center disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiCornerUpLeft size={13} /> Undo
          </button>
        </div>

        <div className="card flex-1 p-5">
          <p className="eyebrow mb-3">Moves</p>
          {rows.length === 0 ? (
            <p className="text-xs text-ink-faint">Drag or tap a white piece to start.</p>
          ) : (
            <ol className="max-h-80 space-y-1 overflow-y-auto text-xs">
              {rows.map((r) => (
                <li key={r.n} className="flex gap-3 tabular-nums">
                  <span className="w-6 shrink-0 text-ink-faint">{r.n}.</span>
                  <span className="w-16 text-ink">{r.w}</span>
                  <span className="text-ink-muted">{r.b || ''}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </aside>
    </div>
  );
}
