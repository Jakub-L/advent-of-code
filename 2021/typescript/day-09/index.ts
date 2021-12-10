/**
 * Solution to Day 9 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/9
 */
import { readInput } from '../utils';

// TYPES

// INPUTS
const depths = readInput('./../../inputs/day-09.txt').map((row) =>
  row.split('').map(Number)
);
const test = [
  '2199943210',
  '3987894921',
  '9856789892',
  '8767896789',
  '9899965678',
].map((row) => row.split('').map(Number));

// UTILS
const findMinima = (depths: number[][]): number[] =>
  depths.reduce(
    (min, row, i) => [
      ...min,
      ...row.filter((num, j) =>
        [
          [i - 1, j],
          [i, j - 1],
          [i, j + 1],
          [i + 1, j],
        ].every(
          ([row, col]) =>
            depths[row]?.[col] === undefined || num < depths[row][col]
        )
      ),
    ],
    []
  );

// PART 1
const sumRisk = (depths: number[][]): number =>
  findMinima(depths).reduce((acc, minimum) => acc + minimum + 1, 0);

// PART 2

// OUTPUTS
console.log(sumRisk(depths));
// console.log(`Part 1: ${}`);
// console.log(`Part 2: ${}`);
