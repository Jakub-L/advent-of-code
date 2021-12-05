/**
 * Solution to Day 4 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/4
 */
import { readInput } from '../utils';

// INPUTS
const lines = readInput('./../../inputs/day-05.txt').map((line) =>
  line.split(' -> ').map((coords) => coords.split(',').map(Number))
);

// PART 1 & 2
/**
 * Find the number of times a set of lines overlaps
 * @param {Array.<Array.<Array.<number>>>} lines - Array of lines to draw, each line a pair of number arrays
 * which are the coordinates of the start and end points
 * @param {boolean} countDiagonals - Should the script consider diagonal lines
 * @returns {number} The number of points at which at least 2 lines overlap
 */
const countOverlaps = (
  lines: Array<Array<Array<number>>>,
  countDiagonals: boolean
): number => {
  const points: { [index: string]: number } = {};
  for (let line of lines) {
    let [[x, y], [x1, y1]] = line;
    const [dx, dy] = [Math.sign(x1 - x), Math.sign(y1 - y)];
    if (!countDiagonals && dx !== 0 && dy !== 0) continue;
    while (x !== x1 || y !== y1) {
      points[`${x},${y}`] = 1 + (points[`${x},${y}`] || 0);
      if (x !== x1) x += dx;
      if (y !== y1) y += dy;
    }
    points[`${x},${y}`] = 1 + (points[`${x},${y}`] || 0);
  }
  return Object.values(points).reduce(
    (acc, overlaps) => acc + (overlaps > 1 ? 1 : 0),
    0
  );
};

// OUTPUTS
console.log(`Part 1: ${countOverlaps(lines, false)}`);
console.log(`Part 2: ${countOverlaps(lines, true)}`);
