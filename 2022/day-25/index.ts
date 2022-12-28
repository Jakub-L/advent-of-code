/**
 * Solution to Day 25 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/25
 */
import { readInput } from '../utils';

// INPUTS
const snafuInput: string[] = readInput('./day-25/input.txt');

// UTILS
const digits: string[] = ['=', '-', '0', '1', '2'];

// PART 1
/**
 * Converts from SNAFU to decimal
 * @param {string} number - SNAFU number to convert
 * @returns {number} input as a decimal number
 */
const fromSnafu = (number: string): number =>
  number
    .split('')
    .reverse()
    .reduce((sum, d, i) => sum + (digits.indexOf(d) - 2) * 5 ** i, 0);

/**
 * Converts from decimal to SNAFU
 * @param {number} number - Decimal number to convert
 * @returns {string} input as a SNAFU number
 */
const toSnafu = (number: number): string => {
  let result = '';
  while (number > 0) {
    const d = (number + 2) % 5;
    number = Math.floor((number + 2) / 5);
    result = `${digits[d]}${result}`;
  }
  return result;
};

// PART 1
const sum = snafuInput.reduce((sum, n) => sum + fromSnafu(n), 0);

// RESULTS
console.log(`Part 1 solution: ${toSnafu(sum)}`);
