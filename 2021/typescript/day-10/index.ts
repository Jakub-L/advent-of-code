/**
 * Solution to Day 9 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/9
 */
import { readInput } from '../utils';

// INPUTS
const lines = readInput('./../../inputs/day-10.txt');
const test = [
  '[({(<(())[]>[[{[]{<()<>>',
  '[(()[<>])]({[<{<<[]>>(',
  '{([(<{}[<>[]}>{[]{[(<()>',
  '(((({<>}<{<{<>}{[]{[]{}',
  '[[<[([]))<([[{}[[()]]]',
  '[{[{({}]{}}([{[{{{}}([]',
  '{<[[]]>}<{[{[{[]{()[[[]',
  '[<(<(<(<{}))><([]([]()',
  '<{([([[(<>()){}]>(<<{{',
  '<{([{{}}[<[[[<>{}]]]>[]]'
];

// UTILS
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
const scoreIllegal = (lines: string[]) => {
  const scores: { [index: string]: number } = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137
  };
  return lines.reduce((sum, line) => sum + (scores[findBadChar(line)] || 0), 0);
};

// PART 2

// OUTPUTS
console.log(`Part 1: ${scoreIllegal(lines)}`);
// console.log(`Part 2: `);
