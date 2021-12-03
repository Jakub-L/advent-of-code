/**
 * Solution to Day 3 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/3
 */
import { readInput } from '../utils';

// INPUTS
const diagnostics = readInput('./../../inputs/day-03.txt').map((num) =>
  num.split('').map((d) => parseInt(d, 2))
);

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
 * @param {Array.<Array.<number>>} diag - Array of diagnostic binary diag, split into digits
 * @returns {number} Power consumption of the submarine
 */
const findPowerConsumption = (diag: number[][]): number => {
  const gamma = findGamma(diag);
  return (
    parseInt(gamma, 2) *
    (parseInt(gamma, 2) ^ parseInt('1'.repeat(gamma.length), 2))
  );
};

// PART 2
/**
 * Compares an array of binary numbers bit-by-bit against the most common bit for that array in
 * a given position. Filters out those that don't match the most common bit and recalculates the
 * most common bit again.
 * @param {Array.<Array.<number>>} diag - Array of diagnostic binary diag, split into digits
 * @param {boolean} leastCommon - Whether the comparison should be made against the least-common
 * @returns {string} A string representing the bits of the diagnostic matching the bit criterion
 */
const findByBitCriteria = (diag: number[][], leastCommon: boolean): string => {
  for (let i = 0; i < diag[0].length; i += 1) {
    const gamma = findGamma(diag);
    // X ^ 1 flips the X bit for comparing against the least common bit
    diag = diag.filter((number) => number[i] === (+gamma[i] ^ +leastCommon));
    if (diag.length === 1) return diag[0].join('');
  }
  return '';
};

/**
 * Finds the life support rating by finding the Oxygen rating (comparing against most common bit)
 * and the CO2 rating (comparing against least common bit) and finding the product of the two.
 * @param {Array.<Array.<number>>} diag - Array of diagnostic binary diag, split into digits
 * @returns {number} The product of the CO2 and Oxygen ratings
 */
const findLifeSupportRating = (diag: number[][]): number =>
  parseInt(findByBitCriteria(diag, false), 2) *
  parseInt(findByBitCriteria(diag, true), 2);

// Outputs
console.log(`Part 1: ${findPowerConsumption(diagnostics)}`);
console.log(`Part 2: ${findLifeSupportRating(diagnostics)}`);
