/**
 * Solution to Day 3 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/3
 */
import { readInput } from '../utils';

// INPUTS
const diagnostics = readInput('./../../inputs/day-03.txt').map((num) =>
  num.split('').map((d) => parseInt(d, 2))
);
const test = [
  '00100',
  '11110',
  '10110',
  '10111',
  '10101',
  '01111',
  '00111',
  '11100',
  '10000',
  '11001',
  '00010',
  '01010'
].map((num) => num.split('').map((d) => parseInt(d, 2)));

// UTILS

// PART 1
/**
 * Finds the gamma number, representing the most common positional binary digits.
 * Sums the digits in each position, then for each position checks if the digit sum is
 * higher than the length of the diagnostics / 2 - if so, the most common digit for
 * that position is 1.
 * @param {Array.<Array.<number>>} diag - Array of diagnostic binary diag, split into digits
 * @returns {string} The binary representation of the most common binary digits
 */
const findGamma = (diag: number[][]): string =>
  diag
    .reduce((acc, number) => {
      number.forEach((digit, i) => (acc[i] = digit + (acc[i] || 0)));
      return acc;
    }, [])
    .reduce((gamma, count) => `${gamma}${+(count >= diag.length / 2)}`, '');

/**
 * Calculates the power consumption of the submarine
 * @param {string} gamma - Binary number representing most common digits in diagnostics
 * @returns {number} Power consumption of the submarine
 */
const findPowerConsumption = (gamma: string): number =>
  parseInt(gamma, 2) *
  (parseInt(gamma, 2) ^ parseInt('1'.repeat(gamma.length), 2));

// PART 2

// Outputs
const gamma = findGamma(diagnostics);
console.log(findPowerConsumption(gamma));
