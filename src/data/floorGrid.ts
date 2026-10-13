import type { ClubItem } from "../types";

// The dance floor is a 10x8 tile grid. Each row is its own priced item
// (10 tiles) in the Dance Floor zone — buy a row, that whole section of
// floor clears at once.
export const FLOOR_COLS = 10;
export const FLOOR_ROWS = 8;
const ROW_PRICES = [100, 110, 125, 140, 150, 160, 170, 180];

const BOX = { xMin: 15, xMax: 85, yMin: 28, yMax: 82 }; // the dance floor now has its own full room
const CLUTTER_CYCLE = ["📦", "🗑️", "🧻", "🪵", "📰", "🥫", "🍂", "🪨"];

export interface FloorTileLayout {
  row: number;
  col: number;
  x: number;
  y: number;
  clutterEmoji: string;
}

export const FLOOR_TILE_LAYOUT: FloorTileLayout[] = Array.from({ length: FLOOR_ROWS * FLOOR_COLS }, (_, i) => {
  const row = Math.floor(i / FLOOR_COLS);
  const col = i % FLOOR_COLS;
  const colWidth = (BOX.xMax - BOX.xMin) / FLOOR_COLS;
  const rowHeight = (BOX.yMax - BOX.yMin) / FLOOR_ROWS;
  return {
    row,
    col,
    x: BOX.xMin + (col + 0.5) * colWidth,
    y: BOX.yMax - (row + 0.5) * rowHeight,
    clutterEmoji: CLUTTER_CYCLE[(row + col) % CLUTTER_CYCLE.length],
  };
});

export const FLOOR_ROW_ITEMS: ClubItem[] = Array.from({ length: FLOOR_ROWS }, (_, row) => ({
  id: `floor-row-${row}`,
  zone: "Dance Floor",
  price: ROW_PRICES[row],
  emoji: "▦",
  clutterEmoji: "🧹",
  x: BOX.xMin + (BOX.xMax - BOX.xMin) / 2,
  y: BOX.yMax - (row + 0.5) * ((BOX.yMax - BOX.yMin) / FLOOR_ROWS),
  size: 16,
  label: `Floor row ${row + 1} of ${FLOOR_ROWS}`,
  kind: "floorRow",
  floorRow: row,
}));
