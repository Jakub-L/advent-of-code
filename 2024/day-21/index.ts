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

const bestRobot = (path: string, depth: number): number => {
  if (depth === 1) return path.length;
  let result = 0;
  let start = DIRPAD["A"];
  const invalid = DIRPAD["Invalid"];
  for (const val of path) {
    const end = DIRPAD[val];
    result += cheapestDirpadMove(start, end, depth - 1, invalid);
    start = end;
  }
  return result;
};

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

const shortestManualSequence = (value: string, robotCount: number): number => {
  const invalid = NUMPAD["Invalid"];
  let result = 0;
  let start = NUMPAD["A"];
  for (const val of value) {
    const end = NUMPAD[val];
    result += cheapestNumpadMove(start, end, robotCount, invalid)!;
    start = end;
  }
  return result;
};

const complexity = (value: string, robotCount: number = 3): number => {
  return parseInt(value, 10) * shortestManualSequence(value, robotCount);
};

// Results
// const expectedSampleResult = [68, 60, 68, 64, 64];

// for (let i = 0; i < sample.length; i++) {
//   const result = shortestManualSequence(sample[i]);
//   console.log(result, result === expectedSampleResult[i]);
// }

console.log(sum(input.map(code => complexity(code))));
console.log(sum(input.map(code => complexity(code, 26))));
