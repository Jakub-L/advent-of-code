/**
 * Solution to Day 6 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/6
 */
import { readInput } from '../utils';

console.time('a');

// INPUTS
const fish = readInput('./../../inputs/day-06.txt', ',').map(Number);
const test = [3, 4, 3, 1, 2];

// UTILS
const dayCounts = (days: number): Array<number> => {
  const counts: number[] = [1];
  let fish: number[] = [0];
  for (let i = 0; i < days; i++) {
    fish = fish.reduce<number[]>((acc, f) => {
      if (f === 0) acc.push(6, 8);
      else acc.push(f - 1);
      return acc;
    }, []);
    counts.push(fish.length);
  }
  return counts;
};

// PART 1
const totalCount = (startFish: number[], days: number) => {
  const zeroTimer = dayCounts(days);
  return startFish.reduce((acc, timer) => acc + zeroTimer[days - timer], 0);
};

// OUTPUTS
console.log(`Part 1: ${totalCount(fish, 80)}`);
// console.log(`Part 2: ${totalCount(test, 256)}`);
console.timeEnd('a');
