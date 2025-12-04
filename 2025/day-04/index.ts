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
const REMOVAL_LIMIT = 4;

// Input
const input: string[][] = readFile(__dirname + "/input.txt", ["\n", ""]) as string[][];

// Part 1 & 2
/**
 * Counts the number of neighbours to a roll. Looks at all 8 neighbouring grid positions
 * (diagonals included) and counts the number of "@" characters.
 *
 * @param grid - Grid representing the layout of the printing department
 * @param x - Column position of point of interest
 * @param y - Row position of point of interest
 * @returns Number of neighbours that have occupied spaces
 */
const countNeighbours = (grid: string[][], x: number, y: number): number => {
  return NEIGHBOURS.reduce((acc, [dx, dy]) => {
    const neighbour = grid[y + dy]?.[x + dx];
    return neighbour === "@" ? acc + 1 : acc;
  }, 0);
};

/**
 * Counts how many rolls can be removed from the printing department.
 *
 * A roll can be removed if the number of its neighbours is below a limit, default 4.
 * If number of iterations is greater than 1, the rolls will be removed, replaced by
 * empty space (".") and the process will repeat to see if any more rolls can be removed.
 *
 * The loop breaks if either the number of iterations is exceeded, or there can be no
 * more rolls removed.
 *
 * @param grid - Grid representing the layout of the printing department
 * @param maxIterations - How many times to remove rolls. Defaults to a single removal.
 * @returns Number of rolls that can be removed in the provided number of iterations
 */
const countAccessibleRolls = (grid: string[][], maxIterations: number = 1): number => {
  let totalCount = 0;
  for (let i = 0; i < maxIterations; i++) {
    let count = 0;
    const nextGrid: string[][] = [];
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const char = grid[y][x];

        if (!nextGrid[y]) nextGrid[y] = [];
        nextGrid[y][x] = char;

        if (char === "@" && countNeighbours(grid, x, y) < REMOVAL_LIMIT) {
          count++;
          nextGrid[y][x] = ".";
        }
      }
    }
    if (count === 0) return totalCount;
    totalCount += count;
    grid = nextGrid;
  }
  return totalCount;
};

// Results
console.log(`Part 1: ${countAccessibleRolls(input)}`);
console.log(`Part 2: ${countAccessibleRolls(input, Number.MAX_SAFE_INTEGER)}`);
