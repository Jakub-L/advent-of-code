/**
 * Solution to Day 11 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/11
 */
import { readInput } from '../utils';

// INPUTS
const octopuses = readInput('./../../inputs/day-11.txt').map((row) =>
  row.split('').map(Number)
);

// UTILS
const FLASH_LIMIT = 9;
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

/** Class representing a cavern full of octopuses */
class Cavern {
  grid: number[][];
  size: number;
  flashes: number;

  /**
   * Creates a new octopus-filled cavern
   * @param {number[][]} octopuses - 2D grid of octopus energies, as integers
   */
  constructor(octopuses: number[][]) {
    this.grid = octopuses;
    this.size = octopuses.reduce((acc, row) => acc + row.length, 0);
    this.flashes = 0;
  }

  /**
   * Flashes an octopus and energises its neighbours
   * @param {number} i - Row of the flashing octopus
   * @param {number} j - Column of the flashing octopus
   */
  flash(i: number, j: number) {
    this.flashes += 1;
    this.grid[i][j] = 0;
    neighbours.forEach(([di, dj]) => {
      if (this.grid[i + di]?.[j + dj]) this.grid[i + di][j + dj] += 1;
    });
  }

  /**
   * Increments the time by one step. Increases energy of all octopuses by 1
   * and flashes any octopuses with energy > FLASH_LIMIT
   */
  step() {
    this.grid = this.grid.map((row) => row.map((n) => n + 1));
    let flashed;
    do {
      flashed = false;
      this.grid.forEach((row, i) =>
        row.forEach((n, j) => {
          if (n > FLASH_LIMIT) {
            this.flash(i, j);
            flashed = true;
          }
        })
      );
    } while (flashed);
  }

  /**
   * Finds the first point of synchronous flashing
   * @returns {number} First step after which all octopuses flash synchronisedly
   */
  findSyncStep(): number {
    let prevFlashes;
    for (let i = 1; true; i += 1) {
      prevFlashes = this.flashes;
      this.step();
      if (prevFlashes + this.size === this.flashes) return i;
    }
  }
}

// PART 1
const firstCavern = new Cavern(octopuses);
for (let i = 0; i < 100; i += 1) firstCavern.step();

// PART 2
const secondCavern = new Cavern(octopuses);

// OUTPUTS
console.log(`Part 1: ${firstCavern.flashes}`);
console.log(`Part 2: ${secondCavern.findSyncStep()}`);
