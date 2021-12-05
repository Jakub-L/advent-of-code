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
const lines = readInput('./../../inputs/day-05.txt').map((line) =>
  line.split(' -> ').map((coords) => coords.split(',').map(Number))
);

// PART 1 & 2
const countOverlaps = (
  lines: Array<Array<Array<number>>>,
  countDiagonals: boolean
): number => {
  const points: { [index: string]: number } = {};
  for (let line of lines) {
    let [[x0, y0], [x1, y1]] = line;
    const [dx, dy] = [Math.sign(x1 - x0), Math.sign(y1 - y0)];
    if (!countDiagonals && dx !== 0 && dy !== 0) continue;
    while (x0 !== x1 || y0 !== y1) {
      points[`${x0},${y0}`] = 1 + (points[`${x0},${y0}`] || 0);
      if (x0 !== x1) x0 = x0 + dx;
      if (y0 !== y1) y0 = y0 + dy;
    }
    points[`${x0},${y0}`] = 1 + (points[`${x0},${y0}`] || 0);
  }
  return Object.values(points).reduce(
    (acc, overlaps) => acc + +(overlaps > 1),
    0
  );
};

// OUTPUTS
console.log(`Part 1: ${countOverlaps(lines, false)}`);
console.log(`Part 2: ${countOverlaps(lines, true)}`);
