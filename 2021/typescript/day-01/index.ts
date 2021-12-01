/**
 * Solution to Day 1 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/1
 */
import { readInput } from '../utils';

// INPUTS
const depths: Array<number> = readInput('./../../inputs/day-01.txt').map(
  Number
);

// PARTS 1 & 2
/**
 * Counts the number of increasing measurements, by considering N-length window of
 * measurements. Sums N consecutive numbers in each window and compares the sums. If
 * window = 1, this is equivalent to comparing each value individually.
 * @param {Array.<number>} depths - Array of depth measurements
 * @param {number} window - The length of the window to consider
 * @returns {number} Number of increasing 3-long measurement windows
 */
const countIncreases = (depths: Array<number>, window: number): number =>
  depths
    .map((_, i) => depths.slice(i, i + window).reduce((acc, n) => acc + n, 0))
    .reduce(
      (acc, depth, i, arr) =>
        i !== arr.length && depth < arr[i + 1] ? acc + 1 : acc,
      0
    );

// Outputs
console.log(`Part 1: ${countIncreases(depths, 1)}`);
console.log(`Part 2: ${countIncreases(depths, 3)}`);
