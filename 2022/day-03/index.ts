/**
 * Solution to Day 3 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/3
 */
import { readInput } from '../utils';

// INPUTS
const backpacks: string[] = readInput('./day-03/input.txt', '\n');

// PART 1 & 2
/**
 * Finds the priority of an alphabetic string, where a = 1, z = 26, A = 27, Z = 52, etc.
 * @param {string} item - A single-character a-z, A-Z string
 * @returns {number} Priority of the character
 */
const findPriority = (item: string): number =>
  item.charCodeAt(0) - (item.charCodeAt(0) > 96 ? 96 : 38);

// PART 1
/**
 * Finds the item apprearing in both first and second half of the backpack
 * @param {string} backpack - A string representing the contents of a backpack
 * @returns {string} The shared character
 */
const findSharedItem = (backpack: string): string => {
  const items: { [index: string]: boolean } = {};
  for (let i = 0; i < backpack.length; i++) {
    if (i < backpack.length / 2) items[backpack[i]] = true;
    else if (backpack[i] in items) return backpack[i];
  }
  return '';
};

// PART 2
/**
 * Converts a backpack to an easy to inspect and look up object
 * @param {string} backpack - A string representing the contents of a backpack
 * @returns {Object.<string, boolean>}Object with appearing letters as keys
 */
const createLetterDict = (backpack: string): { [index: string]: boolean } =>
  backpack.split('').reduce((acc, char) => ({ ...acc, [char]: true }), {});

/**
 * Finds the first character (measuring in order of appearance in the first backpack)
 * to be shared by all backpacks in a group.
 *
 * @param {string[]} group - An array of backpacks
 * @returns {string} The first character to appear in all backpacks of a group
 */
const findBadge = (group: string[]): string => {
  const lookups = group.map(createLetterDict);
  for (const char in lookups[0]) {
    if (lookups.every(lookup => char in lookup)) return char;
  }
  return '';
};

/**
 * Splits an array into an array of sub-chunks of equal size. Last chunk may be smaller, if
 * there are insufficient elements in input array.
 * @param {Array.<T>} arr - Any array
 * @param {number} chunkSize - Target size of a chunk
 * @returns {Array.<Array.<T>>} - Array of sub-array of chunkSize
 * @template T
 */
const chunk = <T>(arr: T[], chunkSize: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) result.push(arr.slice(i, i + chunkSize));
  return result;
};

// RESULTS
console.log(
  `Part 1 solution: ${backpacks
    .map(findSharedItem)
    .reduce((acc, item) => acc + findPriority(item), 0)}`
);
console.log(
  `Part 2 solution: ${chunk(backpacks, 3)
    .map(findBadge)
    .reduce((acc, badge) => acc + findPriority(badge), 0)}`
);
