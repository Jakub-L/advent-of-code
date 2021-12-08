/**
 * Solution to Day 7 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/7
 */
import { readInput } from '../utils';

// INPUTS
const crabs = readInput('./../../inputs/day-07.txt', ',').map(Number);

// UTILS
/**
 * Finds the median of an array. For an even-length array, returns the nearest number below the mean
 * @param {Array.<number>} arr - An array of numbers
 * @returns {number} The median of the array
 */
const findMedian = (arr: Array<number>): number => {
  const medianIndex = Math.floor(arr.length / 2) - 1;
  return arr.sort((a, b) => a - b)[medianIndex];
};

/**
 * Finds the  mean of an array
 * @param {Array.<number>} arr - An array of numbers
 * @returns {number} The n mean of the array
 */
const findMean = (arr: Array<number>): number =>
  arr.reduce((sum, n) => sum + n, 0) / arr.length;

// PART 1
/**
 * Finds the minimum amount of fuel required to align crabs. Fuel cost is proportional to number of steps
 * @param {Array.<number>} crabs - An array of numbers representing the initial crab positions
 * @returns {number} The total minimal fuel expenditure
 */
const countMinimumFuel = (crabs: Array<number>): number => {
  const median = findMedian(crabs);
  return crabs.reduce((sum, crab) => sum + Math.abs(crab - median), 0);
};

// PART 2
/**
 * Finds the minimum amount of fuel required to align crabs. Fuel cost is equal to N * (N + 1) / 2, where
 * N is the number of units the crab must move into alignment
 * @param {Array.<number>} crabs - An array of numbers representing the initial crab positions
 * @returns {number} The total minimal fuel expenditure
 */
const countMinimumTriangularFuel = (crabs: Array<number>): number => {
  // The target must be an integer position
  const mean = Math.floor(findMean(crabs));
  return crabs.reduce(
    (sum, crab) =>
      sum + (Math.abs(crab - mean) * (Math.abs(crab - mean) + 1)) / 2,
    0
  );
};

// OUTPUTS
console.log(`Part 1: ${countMinimumFuel(crabs)}`);
console.log(`Part 2: ${countMinimumTriangularFuel(crabs)}`);
