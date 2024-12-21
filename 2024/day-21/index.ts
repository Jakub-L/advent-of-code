import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// Types
type Coord = { x: number; y: number };
type Button = { x: number; y: number; val: string };

// Constants
/** Dictionary of (x,y) coordinates and the numeric keypad buttons at that location */
const LOC_TO_NUM: Record<string, Button> = {
  "0,0": { x: 0, y: 0, val: "7" },
  "1,0": { x: 1, y: 0, val: "8" },
  "2,0": { x: 2, y: 0, val: "9" },
  "0,1": { x: 0, y: 1, val: "4" },
  "1,1": { x: 1, y: 1, val: "5" },
  "2,1": { x: 2, y: 1, val: "6" },
  "0,2": { x: 0, y: 2, val: "1" },
  "1,2": { x: 1, y: 2, val: "2" },
  "2,2": { x: 2, y: 2, val: "3" },
  "1,3": { x: 1, y: 3, val: "0" },
  "2,3": { x: 2, y: 3, val: "A" }
};

/** Dictionary of numeric keypad buttons and their (x,y) coordinates */
const NUM_TO_LOC: Record<string, Coord> = {
  "7": { x: 0, y: 0 },
  "8": { x: 1, y: 0 },
  "9": { x: 2, y: 0 },
  "4": { x: 0, y: 1 },
  "5": { x: 1, y: 1 },
  "6": { x: 2, y: 1 },
  "1": { x: 0, y: 2 },
  "2": { x: 1, y: 2 },
  "3": { x: 2, y: 2 },
  "0": { x: 1, y: 3 },
  A: { x: 2, y: 3 }
};

/** Dictionary of (x,y) coordinates and the directional buttons at that location */
const LOC_TO_DIR: Record<string, Button> = {
  "1,0": { x: 1, y: 0, val: "^" },
  "2,0": { x: 2, y: 0, val: "A" },
  "0,1": { x: 0, y: 1, val: "<" },
  "1,1": { x: 1, y: 1, val: "v" },
  "2,1": { x: 2, y: 1, val: ">" }
};

/** Dictionary of directional buttons and their (x,y) coordinates */
const DIR_TO_LOC: Record<string, Coord> = {
  "^": { x: 1, y: 0 },
  A: { x: 2, y: 0 },
  "<": { x: 0, y: 1 },
  v: { x: 1, y: 1 },
  ">": { x: 2, y: 1 }
};

// Input
const input: string[] = readFile(`${__dirname}/input`) as string[];
