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

// PART 1
/**
 * Finds the depths of local minimum points. Does not look at diagonal neighbours.
 * @param {number[][]} depths - 2D map of sea bed depths as digits from 0 to 9
 * @returns {number[]} Array of the depths of the local minima
 */
const findMinima = (depths: number[][]): number[] =>
  depths.reduce(
    (min, row, i) =>
      min.concat(
        row.filter((num, j) =>
          [
            [i - 1, j],
            [i, j - 1],
            [i, j + 1],
            [i + 1, j],
          ].every(
            ([row, col]) =>
              depths[row]?.[col] === undefined || num < depths[row][col]
          )
        )
      ),
    []
  );

/**
 * Finds the sum or risks for minimum points, where risk = depth + 1
 * @param {number[]} minima - Array of the depths of local minima
 * @returns {number} Sum of risks across all minima
 */
const sumRisk = (minima: number[]): number =>
  minima.reduce((acc, minimum) => acc + minimum + 1, 0);

// PART 2
const identifyBasins = (depths: number[][]) => {
  const neighbours = [
    [-1, 0],
    [0, -1],
    [0, 1],
    [1, 0],
  ];
  const basinMap: Array<Array<null | number>> = depths.map((row) =>
    Array(row.length).fill(null)
  );
  const basins = [0];

  for (let i = 0; i < depths.length; i++) {
    for (let j = 0; j < depths[i].length; j++) {
      if (depths[i][j] === 9) continue;
      let basin = basinMap[i][j];
      if (!basin) {
        basin = basins.length;
        basins.push(1);
        basinMap[i][j] = basin;
      }
      neighbours.forEach(([di, dj]) => {
        if (
          basinMap[i + di]?.[j + dj] !== undefined &&
          basinMap[i + di][j + dj] === null &&
          depths[i + di][j + dj] !== 9
        ) {
          basinMap[i + di][j + dj] = basin;
        }
      });
    }
  }
  console.log(basinMap.join('\n'), '\n');
};

// OUTPUTS
console.log(`Part 1: ${sumRisk(findMinima(depths))}`);
identifyBasins(test);
// console.log(`Part 2: ${}`);
