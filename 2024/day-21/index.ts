import { Queue } from "@jakub-l/aoc-lib/data-structures";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

// Types
type Position = { x: number; y: number };
type Node = { x: number; y: number; path: string };
type Pad = Record<string, Position>;

// Constants
const NUMPAD: Pad = {
  "7": { x: 0, y: 0 },
  "8": { x: 1, y: 0 },
  "9": { x: 2, y: 0 },
  "4": { x: 0, y: 1 },
  "5": { x: 1, y: 1 },
  "6": { x: 2, y: 1 },
  "1": { x: 0, y: 2 },
  "2": { x: 1, y: 2 },
  "3": { x: 2, y: 2 },
  Invalid: { x: 0, y: 3 },
  "0": { x: 1, y: 3 },
  A: { x: 2, y: 3 }
};

const DIRPAD: Pad = {
  Invalid: { x: 0, y: 0 },
  "^": { x: 1, y: 0 },
  A: { x: 2, y: 0 },
  "<": { x: 0, y: 1 },
  v: { x: 1, y: 1 },
  ">": { x: 2, y: 1 }
};

// Input
const input: string[] = readFile(`${__dirname}/input.txt`) as string[];
const sample: string[] = ["029A", "980A", "179A", "456A", "379A"];

// Part 1 & 2
const numpadMemo = new Map<string, number>();
const dirpadMemo = new Map<string, number>();

/**
 * Calculates the cheapest move from one position to another on a numpad.
 * "Cheapest" is defined as the path with the fewest moves for all the robots
 * in the stack.
 *
 * @param {Position} start - The starting position
 * @param {Position} end - The ending position
 * @param {number} robots - The number of robots
 * @param {Position} invalid - The invalid position, which casues the robot to
 *                   immediately terminate.
 * @returns {number} The number of moves required to move from start to end
 */
const cheapestNumpadMove = (
  start: Position,
  end: Position,
  robots: number,
  invalid: Position
): number => {
  const id = `${start.x},${start.y},${end.x},${end.y},${robots}`;
  if (numpadMemo.has(id)) return numpadMemo.get(id)!;
  let result = Infinity;
  const queue = new Queue<Node>([{ ...start, path: "" }]);
  while (!queue.isEmpty) {
    const { x, y, path } = queue.dequeue();
    if (x === end.x && y === end.y) {
      result = Math.min(result, bestRobot(`${path}A`, robots));
    } else if (x !== invalid.x || y !== invalid.y) {
      if (x < end.x) queue.enqueue({ x: x + 1, y, path: `${path}>` });
      else if (x > end.x) queue.enqueue({ x: x - 1, y, path: `${path}<` });
      if (y < end.y) queue.enqueue({ x, y: y + 1, path: `${path}v` });
      else if (y > end.y) queue.enqueue({ x, y: y - 1, path: `${path}^` });
    }
  }
  numpadMemo.set(id, result);
  return result;
};

/**
 * Finds the best robot's move to complete a move on a directional pad.
 * Accounts for the number of robots in the stack.
 * @param {string} path - Sequence of moves in the form of <, >, ^, v and A
 * @param {number} robots - The number of robots in the stack
 * @returns {number} The number of moves required to complete the path
 */
const bestRobot = (path: string, robots: number): number => {
  if (robots === 1) return path.length;
  let result = 0;
  let start = DIRPAD["A"];
  const invalid = DIRPAD["Invalid"];
  for (const val of path) {
    const end = DIRPAD[val];
    result += cheapestDirpadMove(start, end, robots - 1, invalid);
    start = end;
  }
  return result;
};

/**
 * Calculates the cheapest move for a robot on a directional pad.
 *
 * @param {Position} start - The starting position.
 * @param {Position} end - The target position.
 * @param {number} robots - The number of robots
 * @param {Position} invalid - The invalid position, which casues the robot to
 *                   immediately terminate.
 * @returns {number} - The minimum cost to move.
 */
const cheapestDirpadMove = (
  start: Position,
  end: Position,
  robots: number,
  invalid: Position
): number => {
  const id = `${start.x},${start.y},${end.x},${end.y},${robots}`;
  if (dirpadMemo.has(id)) return dirpadMemo.get(id)!;
  let result = Infinity;
  const queue = new Queue<Node>([{ ...start, path: "" }]);

  while (!queue.isEmpty) {
    const { x, y, path } = queue.dequeue();
    if (x === end.x && y === end.y) {
      result = Math.min(result, bestRobot(`${path}A`, robots));
    } else if (x !== invalid.x || y !== invalid.y) {
      if (x < end.x) queue.enqueue({ x: x + 1, y, path: `${path}>` });
      else if (x > end.x) queue.enqueue({ x: x - 1, y, path: `${path}<` });
      if (y < end.y) queue.enqueue({ x, y: y + 1, path: `${path}v` });
      else if (y > end.y) queue.enqueue({ x, y: y - 1, path: `${path}^` });
    }
  }
  dirpadMemo.set(id, result);
  return result;
};

/**
 * Calculates the length of the shortest manual sequence required to enter
 * a door code.
 *
 * @param {string} code - The door code
 * @param {number} [robotCount=3] - The number of robots
 * @returns {number} The length of the shortest manual sequence
 */
const shortestManualSequence = (code: string, robotCount: number): number => {
  const invalid = NUMPAD["Invalid"];
  let result = 0;
  let start = NUMPAD["A"];
  for (const char of code) {
    const end = NUMPAD[char];
    result += cheapestNumpadMove(start, end, robotCount, invalid)!;
    start = end;
  }
  return result;
};

/**
 * Calculates the complexity of a door code. Complexity is defined as the
 * product of the door code numeric value and the shortest manual sequence
 * required to enter the sequence.
 *
 * @param {string} code - The door code
 * @param {number} [robotCount=3] - The number of robots
 * @returns {number} The complexity of the door code
 */
const complexity = (code: string, robotCount: number = 3): number => {
  return parseInt(code, 10) * shortestManualSequence(code, robotCount);
};

// Results
console.log(`Part 1: ${sum(input.map(code => complexity(code)))}`);
console.log(`Part 2: ${sum(input.map(code => complexity(code, 26)))}`);
