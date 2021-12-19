/**
 * Solution to Day 18 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/18
 */
import { readInput } from '../utils';

// TYPES
type Snailfish = number | Array<Snailfish>;

// INPUTS
const snailfish = readInput('./../../inputs/day-17.txt');
const test = `[1,1]
[2,2]
[3,3]
[4,4]`
  .split('\n')
  .map((e) => JSON.parse(e));

// UTILS
const explode = (num: Snailfish, depth = 0): { didExplode: boolean; val: Snailfish } => {
  // console.log(JSON.stringify(num), depth);
  // if (typeof num === 'number') return { didExplode: false, val: num };
  // else {
  //   const { leftExplode: didExplode, leftVal: val } = explode(num[0], depth + 1);
  //   if (leftExplode)
  // }
};

/**
 * Performs a single split on input number. Also returns whether any numbers were split
 * or not.
 * @param {Snailfish} num - Number or nested array of numbers to try and split
 * @returns {Object} Object containing `didSplit` boolean (true if passed value was split)
 * and the value itself
 */
const split = (num: Snailfish): { didSplit: boolean; val: Snailfish } => {
  if (typeof num === 'number') {
    // If is a number, split it and return new array. Otherwise, keep old number
    if (num >= 10) return { didSplit: true, val: [Math.floor(num / 2), Math.ceil(num / 2)] };
    return { didSplit: false, val: num };
  } else {
    // If is an array, try split left element first, if split, return it
    const { didSplit: leftSplit, val: leftVal } = split(num[0]);
    if (leftSplit) return { didSplit: true, val: [leftVal, num[1]] };
    else {
      // If left element couldn't be split, try splitting right element
      const { didSplit: rightSplit, val: rightVal } = split(num[0]);
      return { didSplit: rightSplit, val: [leftVal, rightVal] };
    }
  }
};

/**
 * Adds two snailfish numbers together and reduces their value if possible
 * @param {Snailfish} a - First snailfish number
 * @param {Snailfish} b - Second snailfish number
 * @returns {Snailfish} The reduced sum of the two numbers
 */
const add = (a: Snailfish, b: Snailfish): Snailfish => reduce([a, b]);

/**
 * Recursively reduces a snailfish number by trying to explode it and then by trying
 * to split it.
 * @param {Snailfish} num - Snailfish number to reduce
 * @returns {Snailfish} The reduced number
 */
const reduce = (num: Snailfish): Snailfish => {
  let didExplode, didSplit, val;
  // Try to explode the number. If exploded, reduce it again
  ({ didExplode, val } = explode(num));
  if (didExplode) return reduce(val);
  // Try to spliut the number. If split, reduce it again
  ({ didSplit, val } = split(num));
  if (didSplit) return reduce(val);
  // If neither exploded or split, return the number
  return val;
};

// PART 1
/**
 * Finds the total magnitude of a snailfish number
 * @param {Snailfish} num - A snailfish number
 * @returns {number} The magnitude
 */
const magnitude = (num: Snailfish): number => {
  if (typeof num === 'number') return num;
  return 3 * magnitude(num[0]) + 2 * magnitude(num[1]);
};

// PART 2

// OUTPUTS
// console.log(`Part 1: ${}`);
// console.log(`Part 2: ${}`);
