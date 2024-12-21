import { Queue } from "@jakub-l/aoc-lib/data-structures";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// Types
type Coord = { x: number; y: number };
type Button = { x: number; y: number; val: string };
type Path = { x: number; y: number; path: string };

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

const DELTA: Record<string, { dx: number; dy: number }> = {
  "^": { dx: 0, dy: -1 },
  v: { dx: 0, dy: 1 },
  "<": { dx: -1, dy: 0 },
  ">": { dx: 1, dy: 0 }
};

// Input
const input: string[] = readFile(`${__dirname}/input.txt`) as string[];

// Part 1
const robotMemo = new Map<string, number>();
const dirpadMemo = new Map<string, number>();

/**
 * Returns whether a given delta (`change`) actually moves `start` closer to `dest`.
 *
 * @param start - The current coordinate (x or y)
 * @param dest  - The target coordinate (x or y)
 * @param change - How much we're moving (+1, -1, or 0)
 */
const isCloser = (start: number, dest: number, change: number): boolean => {
  return (change < 0 && dest < start) || (change > 0 && dest > start);
};

/**
 * Finds the best sequence of directional commands to move between two locations.
 *
 * @param {Coord} start - The starting location
 * @param {Coord} end - The ending location
 * @param {number} depth - The number of layers between the numpad and manual inputs
 * @returns {number} The minimum number of steps to go from start to end
 */
const findBestDirpadMove = (start: Coord, end: Coord, depth: number): number => {
  // console.log("findBestDirpadMove");

  const id = `${start.x},${start.y}-${end.x},${end.y}-${depth}`;
  if (dirpadMemo.has(id)) return dirpadMemo.get(id)!;

  let result = Infinity;
  const queue = new Queue<Path>([{ ...start, path: "" }]);
  while (!queue.isEmpty) {
    const { x, y, path } = queue.dequeue();
    if (x === end.x && y === end.y) {
      result = Math.min(result, findBestRobotMovement(path, depth - 1));
    } else {
      for (const [char, { dx, dy }] of Object.entries(DELTA)) {
        if (isCloser(x, end.x, dx) || isCloser(y, end.y, dy)) {
          queue.enqueue({ x: x + dx, y: y + dy, path: path + char });
        }
      }
    }
  }

  dirpadMemo.set(id, result);
  return result;
};

/**
 * Finds the best robot movement to input directional commands.
 *
 * @param {string} path - The sequence of directional commands
 * @param {number} depth - The number of layers between the numpad and manual inputs
 * @returns {number} The minimum number of steps to input the sequence
 */
const findBestRobotMovement = (path: string, depth: number): number => {
  const id = `${path}-${depth}`;
  if (depth === 1) return path.length;
  if (robotMemo.has(id)) return robotMemo.get(id)!;

  let result = 0;
  let start = DIR_TO_LOC["A"];
  for (const char of path) {
    const end = DIR_TO_LOC[char];
    result += findBestDirpadMove(start, end, depth);
    start = end;
  }
  robotMemo.set(id, result);
  return result;
};

/**
 * Finds the shortest path to go between two locations on the numpad, accounting
 * for the nested robot movements necessary.
 *
 * @param {Coord} start - The starting location
 * @param {Coord} end - The ending location
 * @param {number} depth - The number of layers between the numpad and manual inputs
 * @returns {number} The minimum number of steps to go from start to end
 */
const findShortestNumpadPath = (start: Coord, end: Coord, depth: number): number => {
  let result = Infinity;
  const queue = new Queue([{ ...start, path: "" }]);
  while (!queue.isEmpty) {
    const { x, y, path } = queue.dequeue();
    if (x === end.x && y === end.y) {
      result = Math.min(result, findBestRobotMovement(`${path}A`, depth));
    } else {
      for (const [char, { dx, dy }] of Object.entries(DELTA)) {
        if (isCloser(x, end.x, dx) || isCloser(y, end.y, dy)) {
          queue.enqueue({ x: x + dx, y: y + dy, path: path + char });
        }
      }
    }
  }
  return result;
};

/**
 * Finds the minimum number of manual presses needed to input a given pattern.
 *
 * @param {number} pattern - The code to enter
 * @param {number} [depth=3] - The number of layers between the numpad and manual inputs
 * @returns {number} The minimum number of presses to input the code
 */
const findShortestManualPattern = (pattern: string, depth: number = 3): number => {
  // console.log("findShortestManualPattern");
  let result = 0;
  let start = NUM_TO_LOC["A"];
  for (const char of pattern) {
    const end = NUM_TO_LOC[char];
    result += findShortestNumpadPath(start, end, depth);
    start = end;
  }
  return result;
};

console.log(findShortestManualPattern("029A", 3));
