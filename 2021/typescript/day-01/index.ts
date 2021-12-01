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
 * measurements. If window = 1, this is equivalent to comparing each value individually.
 *
 * Two consecutive windows contain windowSize - 1 of the same numbers. E.g., for windowe = 3:
 * x1 x2 x3 x4
 * A  A  A
 *    B  B  B
 * Therefore, x2 + x3 + x4 > x1 + x2 + x3 if and only if x4 > x1. This can be extended to
 * arrays of any length
 *
 * @param {Array.<number>} depths - Array of depth measurements
 * @param {number} window - The length of the window to consider
 * @returns {number} Number of increasing N-long measurement windows
 */
const countIncreases = (depths: Array<number>, window: number): number =>
  depths.reduce(
    (acc, depth, i, arr) =>
      i < arr.length - window && depth < arr[i + window] ? acc + 1 : acc,
    0
  );

// Outputs
console.log(`Part 1: ${countIncreases(depths, 1)}`);
console.log(`Part 2: ${countIncreases(depths, 3)}`);
