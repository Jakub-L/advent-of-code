/**
 * Solution to Day 9 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/9
 */
import { readInput } from '../utils';

// INPUTS
const depths = readInput('./../../inputs/day-09.txt').map((row) =>
  row.split('').map(Number)
);

// PART 1
/**
 * Finds the depths of local minimum points. Does not look at diagonal neighbours.
 * @param {number[][]} depths - 2D map of sea bed depths as digits from 0 to 9
 * @returns {number[]} Array of the depths of the local minima
 */
const findMinima = (depths: number[][]): number[] =>
  depths.reduce(
    (min, row, i) =>
      min.concat(
        row.filter((num, j) =>
          [
            [i - 1, j],
            [i, j - 1],
            [i, j + 1],
            [i + 1, j]
          ].every(
            ([row, col]) =>
              depths[row]?.[col] === undefined || num < depths[row][col]
          )
        )
      ),
    []
  );

/**
 * Finds the sum or risks for minimum points, where risk = depth + 1
 * @param {number[]} minima - Array of the depths of local minima
 * @returns {number} Sum of risks across all minima
 */
const sumRisk = (minima: number[]): number =>
  minima.reduce((acc, minimum) => acc + minimum + 1, 0);

// PART 2
/**
 * Finds the basins in a depth map and returns their sizes, from largest to smallest
 * @param {number[][]} depths - 2D map of sea bed depths as digits from 0 to 9
 * @returns {number[]} Array of basin sizes, sorted from largest to smallest
 */
const findBasinSizes = (depths: number[][]): number[] => {
  const basinMap: Array<Array<null | number>> = depths.map((row) =>
    Array(row.length).fill(null)
  );
  const basins = [0];

  /**
   *
   * @param {number} i - Row index of the target
   * @param {number} j - Column index of the target
   * @param {number} val - Value
   */
  const markNeighbours = (i: number, j: number, val: number) => {
    [
      [-1, 0],
      [0, -1],
      [0, 1],
      [1, 0]
    ].forEach(([di, dj]) => {
      if (
        depths[i + di]?.[j + dj] !== undefined &&
        depths[i + di][j + dj] !== 9 &&
        basinMap[i + di][j + dj] === null
      ) {
        basins[val] += 1;
        basinMap[i + di][j + dj] = val;
        markNeighbours(i + di, j + dj, val);
      }
    });
  };

  for (let i = 0; i < depths.length; i++) {
    for (let j = 0; j < depths[i].length; j++) {
      if (depths[i][j] === 9) continue;
      let basin = basinMap[i][j];
      if (!basin) {
        basin = basins.length;
        basins.push(1);
        basinMap[i][j] = basin;
      }
      markNeighbours(i, j, basin);
    }
  }
  return basins.sort((a, b) => b - a);
};

/**
 * Finds the product of three largest basin sizes
 * @param {number[]} basins - Array of basin sizes, sorted from largest to smallest
 * @returns {number} The product
 */
const threeLargestBasins = (basins: number[]): number =>
  basins.slice(0, 3).reduce((acc, n) => acc * n, 1);

// OUTPUTS
console.log(`Part 1: ${sumRisk(findMinima(depths))}`);
console.log(`Part 2: ${threeLargestBasins(findBasinSizes(depths))}`);
