import { deepEqual } from "@jakub-l/aoc-lib/utils";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";

type HikeOptions = {
  visited?: Set<string>;
  end?: [number, number];
  start?: [number, number];
};

// prettier-ignore
const validSlope: Record<string, [number, number]> = { "v": [1, 0], "^": [-1, 0], ">": [0, 1], "<": [0, -1] }
// prettier-ignore
const neighbourMoves: [number, number][] = [[0, 1], [0, -1], [1, 0], [-1, 0]];

const getValidMoves = (trails: string[][], [r, c]: [number, number], visited: Set<string>): [number, number][] => {
  const validMoves: [number, number][] = [];
  for (const move of neighbourMoves) {
    const [dr, dc] = move;
    const [rr, cc] = [r + dr, c + dc];
    const char = trails[rr]?.[cc];

    const isVisited = visited.has(`${rr},${cc}`);
    const isPath = char === ".";
    const isInBounds = char !== undefined;
    const isValidSlope = deepEqual(move, validSlope[char]);

    if (!isVisited && isInBounds && (isPath || isValidSlope)) validMoves.push([rr, cc]);
  }
  return validMoves;
};
let juncions = 1;
const longestHike = (trails: string[][], options: HikeOptions = {}): number => {
  let { end = [trails.length - 1, trails.length - 2], start = [0, 1], visited = new Set() } = options;
  let [r, c] = start;
  visited.add(`${r},${c}`);
  let moves = getValidMoves(trails, [r, c], visited);
  while (moves.length === 1) {
    [r, c] = moves[0];
    visited.add(`${r},${c}`);
    moves = getValidMoves(trails, [r, c], visited);
  }
  if (deepEqual([r, c], end)) return visited.size;
  if (moves.length === 0) return 0;
  return Math.max(...moves.map(move => longestHike(trails, { start: move, visited: new Set([...visited]), end })));
};

// INPUT PARSING
const input = readFile(__dirname + "/input.txt", ["\n", ""]) as string[][];

console.log(longestHike(input) - 1);
