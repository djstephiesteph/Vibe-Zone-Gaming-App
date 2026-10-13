// Minimal, dependency-free match-3 engine used by GameBoard.
// Grid is a flat array, row-major, length = size*size. Cell value is a
// tile-kind index (0..kinds-1), or -1 for "empty, about to refill".

export type Board = number[];

export function randomTile(kinds: number): number {
  return Math.floor(Math.random() * kinds);
}

export function makeBoard(size: number, kinds: number): Board {
  let board: Board;
  do {
    board = Array.from({ length: size * size }, () => randomTile(kinds));
  } while (findMatches(board, size).length > 0 || !hasPossibleMove(board, size, kinds));
  return board;
}

function idx(size: number, row: number, col: number) {
  return row * size + col;
}

export interface MatchGroup {
  indices: number[];
  kind: number;
}

// Finds all runs of 3+ in a row or column.
export function findMatches(board: Board, size: number): MatchGroup[] {
  const groups: MatchGroup[] = [];

  for (let r = 0; r < size; r++) {
    let runStart = 0;
    for (let c = 1; c <= size; c++) {
      const cur = c < size ? board[idx(size, r, c)] : -999;
      const prev = board[idx(size, r, c - 1)];
      if (cur !== prev) {
        const runLen = c - runStart;
        if (runLen >= 3 && prev >= 0) {
          groups.push({
            kind: prev,
            indices: Array.from({ length: runLen }, (_, k) => idx(size, r, runStart + k)),
          });
        }
        runStart = c;
      }
    }
  }

  for (let c = 0; c < size; c++) {
    let runStart = 0;
    for (let r = 1; r <= size; r++) {
      const cur = r < size ? board[idx(size, r, c)] : -999;
      const prev = board[idx(size, r - 1, c)];
      if (cur !== prev) {
        const runLen = r - runStart;
        if (runLen >= 3 && prev >= 0) {
          groups.push({
            kind: prev,
            indices: Array.from({ length: runLen }, (_, k) => idx(size, runStart + k, c)),
          });
        }
        runStart = r;
      }
    }
  }

  return groups;
}

export function swap(board: Board, a: number, b: number): Board {
  const next = board.slice();
  [next[a], next[b]] = [next[b], next[a]];
  return next;
}

export function areAdjacent(size: number, a: number, b: number): boolean {
  const ar = Math.floor(a / size), ac = a % size;
  const br = Math.floor(b / size), bc = b % size;
  return (ar === br && Math.abs(ac - bc) === 1) || (ac === bc && Math.abs(ar - br) === 1);
}

// Removes matched cells (-1), drops remaining tiles down, refills from top.
export function collapseAndRefill(board: Board, size: number, matched: Set<number>, kinds: number): Board {
  const next = board.slice();
  for (const i of matched) next[i] = -1;

  for (let c = 0; c < size; c++) {
    const colVals: number[] = [];
    for (let r = 0; r < size; r++) {
      const v = next[idx(size, r, c)];
      if (v !== -1) colVals.push(v);
    }
    const missing = size - colVals.length;
    const refilled = Array.from({ length: missing }, () => randomTile(kinds)).concat(colVals);
    for (let r = 0; r < size; r++) {
      next[idx(size, r, c)] = refilled[r];
    }
  }
  return next;
}

export function hasPossibleMove(board: Board, size: number, kinds: number): boolean {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const i = idx(size, r, c);
      if (c < size - 1) {
        const swapped = swap(board, i, idx(size, r, c + 1));
        if (findMatches(swapped, size).length > 0) return true;
      }
      if (r < size - 1) {
        const swapped = swap(board, i, idx(size, r + 1, c));
        if (findMatches(swapped, size).length > 0) return true;
      }
    }
  }
  return false;
}

export function reshuffle(board: Board, size: number, kinds: number): Board {
  return makeBoard(size, kinds);
}

export const NOTE_GLYPHS: Record<number, string> = {
  0: "🎵",
  1: "🎶",
  2: "🥁",
  3: "🎸",
  4: "🎤",
  5: "🎺",
};
