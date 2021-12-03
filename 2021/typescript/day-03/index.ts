/**
 * Solution to Day 3 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/3
 */
import { readInput } from '../utils';

// INPUTS
const diagnostics = readInput('./../../inputs/day-03.txt');
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
];

// UTILS


// PART 1
const countBits = (binaryStrings: string[]): any => {
  const counts = new Array(binaryStrings[0].length)
    .fill(null)
    .map((e) => [0, 0]);
  for (let str of binaryStrings) {
    for (let i = 0; i < str.length; i += 1) {
      const char = str[i];
      const digit = parseInt(char, 10);
      counts[i][digit] += 1;
    }
  }
  return counts;
};
const findPowerConsumption = (bitCounts: any): number => {
  let epsilon = '';
  let gamma = '';
  for (let pos of bitCounts) {
    gamma = `${gamma}${pos[0] > pos[1] ? 0 : 1}`;
    epsilon = `${epsilon}${pos[0] > pos[1] ? 1 : 0}`;
  }
  console.log(`epsilon ${epsilon}, gamma ${gamma}`);
  return parseInt(epsilon, 2) * parseInt(gamma, 2);
};

// Outputs
console.log(findPowerConsumption(countBits(numbers)));
