import { bestMove } from '@/lib/chess-engine';

/* Runs the negamax search off the main thread so deep searches
   (up to ~3.5s at depth 3) never freeze the page. */
self.onmessage = (e) => {
  const { fen, depth, id } = e.data;
  try {
    self.postMessage({ id, move: bestMove(fen, depth) });
  } catch (err) {
    self.postMessage({ id, move: null, error: String(err) });
  }
};
