/**
 * Solution to Day 10 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/10
 */
import { readInput } from '../utils';

// INPUTS
const lines = readInput('./../../inputs/day-10.txt');

// UTILS
/**
 * Finds the incorrectly placed closing bracket, if present
 * @param {string} line - Line of brackets
 * @returns {string} The bad closing bracket if present, empty string otherwise
 */
const findBadChar = (line: string): string => {
  const pairs: { [index: string]: string } = {
    '(': ')',
    '{': '}',
    '<': '>',
    '[': ']'
  };
  const expected = [];
  for (let char of line) {
    if (pairs[char]) expected.push(pairs[char]);
    else {
      const close = expected.pop();
      if (char !== close) return char;
    }
  }
  return '';
};

// PART 1
/**
 * Finds the total score of all illegal bracket lines in an array
 * @param {string[]} lines - Array of lines of brackets
 * @returns {number} The total score for all illegal lines
 */
const scoreIllegal = (lines: string[]): number => {
  const scores: { [index: string]: number } = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137
  };
  return lines.reduce((sum, line) => sum + (scores[findBadChar(line)] || 0), 0);
};

// PART 2
/**
 * Finds the characters needed to autocomplete a bracket line
 * @param {string} line - Line of brackets
 * @returns {string[]} Characters needed to complete the bracket string
 */
const findCompletion = (line: string): string[] => {
  const pairs: { [index: string]: string } = {
    '(': ')',
    '{': '}',
    '<': '>',
    '[': ']'
  };
  const expected = [];
  for (let char of line) {
    if (pairs[char]) expected.push(pairs[char]);
    else expected.pop();
  }
  return expected.reverse();
};

/**
 * Finds the autocomplete competition score for a completion array
 * @param {string[]} completion - Characters needed to complete the bracket string
 * @returns {number} The score of the completion
 */
const scoreCompletion = (completion: string[]): number => {
  const scores: { [index: string]: number } = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4
  };
  return completion.reduce((acc, char) => 5 * acc + scores[char], 0);
};

const completionScores = lines
  .filter((line) => !findBadChar(line))
  .map(findCompletion)
  .map(scoreCompletion)
  .sort((a, b) => a - b);

// OUTPUTS
console.log(`Part 1: ${scoreIllegal(lines)}`);
console.log(`Part 2: ${completionScores[(completionScores.length - 1) / 2]}`);
