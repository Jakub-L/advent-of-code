/**
 * Solution to Day 1 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/1
 */
import { readInput } from '../utils';

// INPUTS
const elves: number[][] = readInput('./day-01/input.txt', '\n\n').map(elf =>
  elf.split('\n').map(Number)
);

// PART 1 & 2
/**
 * Finds the total calories by the elves that carry the most calories each
 * @param {number[][]} elves - Array of elves, each being an array of calories carried
 * @param {number} topSize - Number of top-calorie-rich elves to look at
 * @returns {number} Total calories carried by the top elves
 */
const topCalorieSum = (elves: number[][], topSize: number): number =>
  elves
    .map(elf => elf.reduce((sum, calories) => sum + calories, 0))
    .sort((a, b) => b - a)
    .slice(0, topSize)
    .reduce((sum, elf) => sum + elf, 0);

// PRINT RESULTS
console.log(`Result for Part 1: ${topCalorieSum(elves, 1)}`);
console.log(`Result for Part 2: ${topCalorieSum(elves, 3)}`);
