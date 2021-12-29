/**
 * Solution to Day 25 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/25
 */
import { readInput } from '../utils';

// INPUTS
const map = readInput('./../../inputs/day-25.txt').map((row) => row.split(''));

// UTILS
/**
 * Checks if two arrays of strings are the same
 * @param {string[][]} a - First array to compare
 * @param {string[][]} b - Second array to compare
 * @returns {boolean} True if the arrays are the same
 */
const isSame = (a: string[][], b: string[][]): boolean =>
  JSON.stringify(a) === JSON.stringify(b);

  /**
   * Deep copies a 2D string map
   * @param {string[][]} source - Array to copy
   * @returns {string[][]} Deep copy of the source 
   */
const copyMap = (source: string[][]): string[][] =>
  Array.from(source).map((_, i) => Array.from(source[i]));

  /**
   * Steps the sea cucumbers, moving eastwards first, then southwards
   * @param {string[][]} map - The initial state of the sea floor
   * @returns {string[][]} The sea floor after a single steps
   */
const step = (map: string[][]): string[][] => {
  const [maxRow, maxCol] = [map.length, map[0].length];
  const eastMap = copyMap(map);

  // Step east
  for (let row = 0; row < maxRow; row++) {
    for (let col = 0; col < maxCol; col++) {
      if (map[row][col] === '>' && map[row][(col + 1) % maxCol] === '.') {
        eastMap[row][(col + 1) % maxCol] = '>';
        eastMap[row][col] = '.';
      }
    }
  }

  // Step south
  const southMap = copyMap(eastMap);
  for (let row = 0; row < maxRow; row++) {
    for (let col = 0; col < maxCol; col++) {
      if (eastMap[row][col] === 'v' && eastMap[(row + 1) % maxRow][col] === '.') {
        southMap[(row + 1) % maxRow][col] = 'v';
        southMap[row][col] = '.';
      }
    }
  }

  return southMap;
};

/**
 * Finds the number of steps needed until the seabed settles
 * @param {string[][]} startMap - The initial state of the seabed
 * @returns {number} Number of steps needed for the seabed to no longer change
 */
const findFinalState = (startMap: string[][]): number => {
  let currMap = startMap;
  for (let i = 1; true; i++) {
    let newMap = step(currMap);
    if (isSame(currMap, newMap)) return i;
    currMap = newMap;
  }
};

// OUTPUTS
console.log(`Part 1: ${findFinalState(map)}`);
