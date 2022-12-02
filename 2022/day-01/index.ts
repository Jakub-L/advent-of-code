/**
 * Solution to Day 1 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/1
 */
import { readInput } from '../utils';

// INPUTS
const calories: number[][] = readInput('./day-01/input.txt', '\n\n').map(elf =>
  elf.split('\n').map(Number)
);

// PART 1
const calorieSums = calories
  .map(elf => elf.reduce((sum, calories) => sum + calories, 0))
  .sort((a, b) => b - a);
const maxCalories = calorieSums[0];

// PART 2
const topThreeSum = calorieSums[0] + calorieSums[1] + calorieSums[2];

// PRINT RESULTS
console.log(`Result for Part 1: ${maxCalories}`);
console.log(`Result for Part 2: ${topThreeSum}`);
