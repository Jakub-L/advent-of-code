import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

const input = readFile(__dirname + "/input.txt", ["\n", " "], x => Number(x)) as unknown as number[][];

// UTILS
/**
 * Finds the differences between consecutive numbers in the input array. This is done
 * repeatedly until the differences are all 0.
 *
 * Example:
 *    [1, 2, 3, 4] -> [1, 1, 1] -> [0, 0]
 *
 * @param {number[]} numbers - The input array of numbers
 * @returns {number[][]} An array of arrays of differences
 */
const findDifferences = (numbers: number[]): number[][] => {
  const allDifferences = [numbers];
  let previousNumbers = numbers ?? [];
  while (previousNumbers.some(n => n !== 0)) {
    const differences = [];
    for (let i = 1; i < previousNumbers.length; i++) {
      differences.push(previousNumbers[i] - previousNumbers[i - 1]);
    }
    allDifferences.push(differences);
    previousNumbers = differences;
  }
  return allDifferences;
};

/**
 * Extrapolates the next number in the sequence based on the differences.
 * 
 * Combines the last number in the differences array with the last number in the
 * difference array above it. For example, if the differences are:
 *    [1, 2, 3, 4] -> [1, 1, 1] -> [0, 0]
 * Then the extrapolated number is:
 *    (0 + 1) + 4 = 5
 *
 * @param {number[][]} differences - The array of differences
 * @param {boolean} [backwards=false] - Whether to extrapolate backwards. Defaults to false.
 * @returns {number} The extrapolated number
 */
const extrapolate = (differences: number[][], backwards: boolean = false): number => {
  const inspectionIndex = backwards ? -1 : 0;
  let number = 0;
  for (let i = differences.length - 2; i >= 0; i--) {
    number = (differences[i].at(inspectionIndex) ?? 0) + (backwards ? -1 : 1) * number;
  }
  return number;
};

// INPUT PROCESSING
const differences = input.map(findDifferences);

// RESULTS
console.log(`Part 1: ${sum(differences.map(d => extrapolate(d)))}`);
console.log(`Part 2: ${sum(differences.map(d => extrapolate(d, true)))}`);
