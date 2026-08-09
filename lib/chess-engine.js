import { Chess } from 'chess.js';

/* Material values for the evaluation the engine maximises. */
const VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };

/* Small central bonus so the engine develops instead of shuffling. */
const CENTER = ['d4', 'e4', 'd5', 'e5'];

/* Score from black's perspective — the engine plays black. */
function evaluate(game) {
  let score = 0;
  for (const row of game.board()) {
    for (const sq of row) {
      if (!sq) continue;
      const v = VALUES[sq.type];
      score += sq.color === 'b' ? v : -v;
      if (CENTER.includes(sq.square)) score += sq.color === 'b' ? 12 : -12;
    }
  }
  return score;
}

/* Captures first, best capture first. Alpha-beta prunes far more of the tree
   with a decent move order. Verbose move objects are reused directly so
   chess.js never has to re-parse SAN inside the search. */
function orderedMoves(game) {
  return game
    .moves({ verbose: true })
    .map((m) => ({
      m,
      // Most-valuable-victim minus least-valuable-attacker, plus promotions.
      s: (m.captured ? VALUES[m.captured] - VALUES[m.piece] / 10 : 0) + (m.promotion ? 800 : 0),
    }))
    .sort((a, b) => b.s - a.s)
    .map((x) => x.m);
}

function search(game, depth, alpha, beta, maximising) {
  if (depth === 0 || game.isGameOver()) {
    if (game.isCheckmate()) return maximising ? -100000 : 100000;
    if (game.isDraw()) return 0;
    return evaluate(game);
  }

  const moves = orderedMoves(game);

  if (maximising) {
    let best = -Infinity;
    for (const m of moves) {
      game.move(m);
      best = Math.max(best, search(game, depth - 1, alpha, beta, false));
      game.undo();
      alpha = Math.max(alpha, best);
      if (alpha >= beta) break;
    }
    return best;
  }

  let best = Infinity;
  for (const m of moves) {
    game.move(m);
    best = Math.min(best, search(game, depth - 1, alpha, beta, true));
    game.undo();
    beta = Math.min(beta, best);
    if (beta <= alpha) break;
  }
  return best;
}

/* Best move for the side to play, as a { from, to, promotion } object.
   Ties break on ply count so openings vary without Math.random. */
export function bestMove(fen, depth) {
  const game = new Chess(fen);
  const moves = orderedMoves(game);
  if (!moves.length) return null;

  let bestScore = -Infinity;
  let best = [];
  for (const m of moves) {
    game.move(m);
    const score = search(game, depth - 1, -Infinity, Infinity, false);
    game.undo();
    if (score > bestScore) {
      bestScore = score;
      best = [m];
    } else if (score === bestScore) {
      best.push(m);
    }
  }

  const chosen = best[game.history().length % best.length];
  return { from: chosen.from, to: chosen.to, promotion: chosen.promotion || 'q' };
}
