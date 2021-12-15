/**
 * Solution to Day 15 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/15
 */
import { readInput, gridShortestPath } from '../utils';

// INPUTS
const input = readInput('./../../inputs/day-15.txt').map((row) =>
  row.split('').map(Number)
);

// PART 2
const mult = 5;
const [row, col] = [input.length, input[0].length];
const bigGrid = Array(row * mult)
  .fill(null)
  .map((_, y) =>
    Array(col * mult)
      .fill(null)
      .map((_, x) => {
        const val =
          input[y % row][x % col] + Math.floor(x / col) + Math.floor(y / row);
        return val > 9 ? val % 9 : val;
      })
  );

// OUTPUTS
console.log(`Part 1: ${gridShortestPath(input)}`);
console.log(`Part 2: ${gridShortestPath(bigGrid)}`);
