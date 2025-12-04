import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// Constants
const NEIGHBOURS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1]
];

// Input
const input: string[][] = readFile(__dirname + "/input.txt", ["\n", ""]) as string[][];
const testInput = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`
  .split("\n")
  .map(line => line.split(""));

// Part 1
const countNeighbours = (grid: string[][], x: number, y: number): number => {
  return NEIGHBOURS.reduce((acc, [dx, dy]) => {
    const neighbour = grid[y + dy]?.[x + dx];
    return neighbour === "@" ? acc + 1 : acc;
  }, 0);
};

const countAccessibleRolls = (grid: string[][], limit: number = 4): number => {
  let count = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "@") {
        const neighbours = countNeighbours(grid, x, y);
        if (neighbours < limit) count++;
      }
    }
  }
  return count;
};

console.log(countAccessibleRolls(input));