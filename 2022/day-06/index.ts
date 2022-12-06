/**
 * Solution to Day 6 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/6
 */
import { readInput } from '../utils';

// INPUTS
const signal: string = readInput('./day-06/input.txt').join('');

// PARTS 1 & 2
/**
 * Finds the index at which a marker appears.
 * @param {string} signal - Input signal of characters
 * @param {number} windowSize - Number of consecutive characters that have to be unique
 *    to indicate the location of the marker
 * @returns {number} One-indexed location of the marker
 */
const findMarker = (signal: string, windowSize: number): number => {
  moveWindow: for (let i = windowSize - 1; i < signal.length; i++) {
    const seenCharacters: { [index: string]: number } = {};
    for (let j = 0; j < windowSize; j++) {
      // Iterate over the window. If a character already appeared, move the window by
      // a space. If it's not appeared, add it to the characters seen.
      if (signal[i - j] in seenCharacters) continue moveWindow;
      else seenCharacters[signal[i - j]] = 1;
    }
    // If the whole window has been searched and not moved along, this means that we
    // found the first non-repeating window. Return the index (add 1 to account for
    // 1-indexing)
    return i + 1;
  }
  return -1;
};

// RESULTS
console.log(`Part 1 solution: ${findMarker(signal, 4)}`);
console.log(`Part 2 solution: ${findMarker(signal, 14)}`);
