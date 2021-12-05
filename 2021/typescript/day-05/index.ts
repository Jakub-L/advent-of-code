/**
 * Solution to Day 4 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/4
 */
import { readInput } from '../utils';

// INPUTS
const test = [
  '0,9 -> 5,9',
  '8,0 -> 0,8',
  '9,4 -> 3,4',
  '2,2 -> 2,1',
  '7,0 -> 7,4',
  '6,4 -> 2,0',
  '0,9 -> 2,9',
  '3,4 -> 1,4',
  '0,0 -> 8,8',
  '5,5 -> 8,2'
].map((line) =>
  line.split(' -> ').map((coords) => coords.split(',').map(Number))
);


// UTILS

// PART 1
const countOverlaps = (lines: Array<Array<Array<number>>>): number => {
  const points: { [index: string]: number } = {};
  for (let line of lines) {
    const [[x0, y0], [x1, y1]] = line;
    if (x0 === x1 || y0 === y1) {
      for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) {
        for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) {
          points[`${x},${y}`] = 1 + (points[`${x},${y}`] ? 1 : 0);
        }
      }
    }
  }
  return Object.values(points).reduce(
    (acc, overlaps) => acc + +(overlaps > 1),
    0
  );
};

// PART 2

// OUTPUTS
console.log(`Part 1: ${countOverlaps(test)}`);
