/**
 * Solution to Day 6 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/6
 */
import { readInput } from '../utils';

// INPUTS
const crabs = readInput('./../../inputs/day-07.txt', ',').map(Number);
const test = '16,1,2,0,4,2,7,1,2,14'.split(',').map(Number);

// PART 1 & 2
const findMedian = (crabs: Array<number>) => {
  const medianIndex = Math.floor(crabs.length / 2) - 1;
  return crabs.sort((a, b) => a - b)[medianIndex];
};

const countFuel = (crabs: Array<number>) => {
  const median = findMedian(crabs);
  return crabs.reduce((sum, crab) => sum + Math.abs(crab - median), 0);
};

const brutePart2 = (crabs: Array<number>) => {
  let sum = 1000000000;
  let newSum;
  for (let t = 0; t < 2000; t++) {
    newSum = crabs.reduce(
      (acc, c) => acc + (Math.abs(c - t) * (Math.abs(c - t) + 1)) / 2,
      0
    );
    if (newSum >= sum) return sum;
    else sum = newSum;
  }
};

// OUTPUTS
// console.log(countFuel(crabs));
console.log(brutePart2(crabs));
// console.log(`Part 1: ${countFish(fish, 80)}`);
// console.log(`Part 2: ${countFish(fish, 256)}`);
