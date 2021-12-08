/**
 * Solution to Day 8 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/8
 */
import { readInput } from '../utils';

// TYPES
/**
 * An array of letters representing a 7-segment display
 * @typedef {Array.<string>} Patterns
 */
type Patterns = Array<string>;
/**
 * An array of patterns representing the known pattern and the output to be decoded
 * @typedef {Array.<Patterns>} Signal
 */
type Signal = Array<Patterns>;

// INPUTS
const signals = readInput('./../../inputs/day-08.txt').map((row) =>
  row.split(' | ').map((entry) => entry.split(' '))
);

// UTILS
/**
 * Counts how many of comparer's characters are in compared
 * @param {string} comparer - String whose characters are looked for
 * @param {string} compared - String which is being searched
 * @returns {number} How many characters of comparer string appear in compared string
 */
const countOverlap = (comparer: string, compared: string): number =>
  comparer.split('').reduce((acc, char) => acc + +compared.includes(char), 0);

/**
 * Decodes the seven-segment display
 * @param {Patters} patterns - Array of strings representing the lit-up segments of the display
 * @returns {Object.<string, number>} A mapping of the patterns (each sorted alphabetically) to the digits they represent
 */
const decodePatterns = (patterns: Patterns): { [index: string]: number } => {
  // After sorting patterns by length, those of unique length can be extracted
  // 1 is the only digit that uses 2 segments and there is no digit that uses fewer
  // 7 is the only digit that uses 3 segments
  // 4 is the only digit that uses 4 segments
  // 8 is the only digit that uses 7 segments and there is no digit that uses more
  patterns = patterns.sort((a, b) => a.length - b.length);
  const decoded: { [index: number]: string } = {
    1: patterns[0],
    7: patterns[1],
    4: patterns[2],
    8: patterns[9]
  };
  for (let num of patterns.slice(3, 9)) {
    const oneOverlap = countOverlap(num, decoded[1]);
    const fourOverlap = countOverlap(num, decoded[4]);
    const sevenOverlap = countOverlap(num, decoded[7]);
    if (num.length === 5) {
      // 3 is the only 5-segment digit that uses 2 of 1's segments
      // 2 is the only 5-segment digit that uses 2 of 4's segments and *doesn't* use 2 of 1's segments
      // 5 is the only remaining 5-segment digit
      if (oneOverlap === 2) decoded[3] = num;
      else if (fourOverlap === 2) decoded[2] = num;
      else decoded[5] = num;
    } else {
      // 9 is the only 6-segment digit that uses 4 of 4's segments and 3 of 7's segments
      // 0 is th eonly 6-segment digit that uses 3 of 7's segments and *doesn't* use 4 of 4's segments
      // 6 is the only remaining 6-segment digit
      if (sevenOverlap === 3 && fourOverlap === 4) decoded[9] = num;
      else if (sevenOverlap === 3) decoded[0] = num;
      else decoded[6] = num;
    }
  }
  // For decoding outputs, it's more useful to have the pattern-to-digit mapping, with patterns being alphabetically sorted
  return Object.entries(decoded).reduce(
    (acc, [key, val]) => ({ ...acc, [val.split('').sort().join('')]: +key }),
    {}
  );
};

/**
 * Decodes the passed signal and returns the decoded output
 * @param {Signal} signal - An array of patterns (first element) and outputs (second element), each
 * of which are arrays of string seven-segment patterns
 * @returns {Array.<number>} Array of decoded outputs as numbers
 */
const decodeSignal = (signal: Signal): Array<number> => {
  const [patterns, output] = signal;
  const decodings: { [index: string]: number } = decodePatterns(patterns);
  return output.map((digit) => decodings[digit.split('').sort().join('')]);
};

// PART 1
/**
 * Decodes signal outputs and counts how many times given digits appear in them
 * @param {Array.<Signal>} signals - An array of signals, each containing a pattern and output
 * @param {Array.<number>} digits - Digits to count within the outputs
 * @returns {number} Total count of occurences of any of the digits in the decoded outputs
 */
const countDigits = (signals: Array<Signal>, digits: Array<number>): number =>
  signals.reduce(
    (sum, signal) =>
      sum +
      decodeSignal(signal).reduce((acc, num) => acc + +digits.includes(num), 0),
    0
  );

// PART 2
/**
 * Decodes signal outputs and sums them
 * @param {Array.<Signal>} signals - An array of signals, each containing a pattern and output
 * @returns {number} The total sum of all the outputs
 */
const sumOutputs = (signals: Array<Signal>): number =>
  signals.reduce(
    (sum, signal) => sum + Number(decodeSignal(signal).join('')),
    0
  );

// OUTPUTS
console.log();
console.log(`Part 1: ${countDigits(signals, [1, 4, 7, 8])}`);
console.log(`Part 2: ${sumOutputs(signals)}`);
