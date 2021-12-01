/**
 * Solution to Day 1 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/1
 */
import { readInput } from '../utils';

// Input parsing
const testDepths: Array<number> = [
  199, 200, 208, 210, 200, 207, 240, 269, 260, 263
];
const depths: Array<number> = readInput('./../../inputs/day-01.txt').map(
  Number
);

// Part 1
/**
 * Counts the number of increasing measurements in an array of depths
 * @param {Array.<number>} depths - Array of depth measurements
 * @returns {number} Number of increasing measurements
 */
const countIncreases = (depths: Array<number>): number =>
  depths.reduce(
    (acc, depth, i, arr) =>
      i !== arr.length && depth < arr[i + 1] ? acc + 1 : acc,
    0
  );
console.log(`Part 1: ${countIncreases(depths)}`);

// Part 2
/**
 * Counts the number of increasing measurements by considering a N-long window.
 * Sums N consecutive numbers in each window and compares the sum, rather
 * than individual values.
 * @param {Array.<number>} depths - Array of depth measurements
 * @param {number} window - The length of the window to consider
 * @returns {number} Number of increasing 3-long measurement windows
 */
const countSlidingWindowIncreases = (
  depths: Array<number>,
  window = 3
): number => {
  return countIncreases(
    depths.map((_, i) =>
      depths.slice(i, i + window).reduce((acc, n) => acc + n, 0)
    )
  );
};

console.assert(countSlidingWindowIncreases(testDepths) === 5);
console.log(`Part 2: ${countSlidingWindowIncreases(depths)}`);
console.log(`Part 2: ${countSlidingWindowIncreases(depths, 1)}`);
