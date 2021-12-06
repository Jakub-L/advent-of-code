/**
 * Solution to Day 6 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/6
 */
import { readInput } from '../utils';

// INPUTS
const fish = readInput('./../../inputs/day-06.txt', ',').map(Number);

// PART 1 & 2
/**
 * Count the number of exponentially dividing lanternfish 
 * @param {Array.<number>} startFish - The array of starting fish ages
 * @param {number} days - Number of days after which the count will be returned
 * @returns {number} Count of fish after specified number of days
 */
const countFish = (startFish: number[], days: number): number => {
  const fish = startFish.reduce<number[]>((acc, age) => {
    acc[age] += 1;
    return acc;
  }, Array(9).fill(0));
  for (let i = 0; i < days; i++) {
    const zeroCount = fish.shift() || 0;
    fish[6] += zeroCount;
    fish.push(zeroCount);
  }
  return fish.reduce((acc, count) => acc + count, 0);
};

// OUTPUTS
console.log(`Part 1: ${countFish(fish, 80)}`);
console.log(`Part 2: ${countFish(fish, 256)}`);
