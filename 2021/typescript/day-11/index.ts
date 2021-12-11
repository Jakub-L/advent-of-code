/**
 * Solution to Day 9 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/9
 */
import { readInput } from '../utils';

// INPUTS
const octopuses = readInput('./../../inputs/day-11.txt').map((row) =>
  row.split('').map(Number)
);

// UTILS
const neighbours = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1]
];

class Cavern {
  grid: number[][];
  gridSize: number;
  flashes: number;
  syncFlash: boolean;

  constructor(octopuses: number[][]) {
    this.grid = octopuses;
    this.gridSize = octopuses.reduce((acc, row) => acc + row.length, 0);
    this.flashes = 0;
    this.syncFlash = false;
  }

  flash(i: number, j: number) {
    neighbours.forEach(([di, dj]) => {
      if (this.grid[i + di]?.[j + dj]) this.grid[i + di][j + dj] += 1;
    });
    this.flashes += 1;
  }

  step() {
    this.grid = this.grid.map((row) => row.map((n) => n + 1));
    let currCount = this.flashes;
    let flashed;

    do {
      flashed = false;
      this.grid.forEach((row, i) =>
        row.forEach((n, j) => {
          if (n > 9) {
            this.grid[i][j] = 0;
            this.flash(i, j);
            flashed = true;
          }
        })
      );
    } while (flashed);
    if (this.flashes - currCount === this.gridSize) this.syncFlash = true;
  }
}

// PART 1
const firstCavern = new Cavern(octopuses);
for (let i = 0; i < 100; i += 1) firstCavern.step();

// PART 2
const findSyncStep = (cavern: Cavern): number => {
  for (let i = 1; true; i += 1) {
    cavern.step();
    if (cavern.syncFlash) return i;
  }
};

const secondCavern = new Cavern(octopuses);
let syncStep = findSyncStep(secondCavern);

// OUTPUTS
console.log(`Part 1: ${firstCavern.flashes}`);
console.log(`Part 2: ${syncStep}`);
