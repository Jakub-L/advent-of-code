/**
 * Solution to Day 21 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/21
 */
import { readInput } from '../utils';

// INPUTS
const monkeys: string[] = readInput('./day-21/input.txt');

// UTILS
type Operation = (a: number, b: number) => number;
type InverseOperation = (c: number, t: number, isLhsNaN: boolean) => number;
type Solutions = { [name: string]: number };
type ComplexMonkey = [lhs: string, op: string, rhs: string];
type ComplexMonkeyDict = { [name: string]: ComplexMonkey };

const operations: { [index: string]: Operation } = {
  '+': (a: number, b: number) => a + b,
  '-': (a: number, b: number) => a - b,
  '/': (a: number, b: number) => a / b,
  '*': (a: number, b: number) => a * b
};
const invOperations: { [index: string]: InverseOperation } = {
  '+': (c: number, t: number, isLhsNaN: boolean) => c - t,
  '-': (c: number, t: number, isLhsNaN: boolean) => (isLhsNaN ? c + t : t - c),
  '/': (c: number, t: number, isLhsNaN: boolean) => (isLhsNaN ? c * t : t / c),
  '*': (c: number, t: number, isLhsNaN: boolean) => c / t
};

/**
 * Sorts monkeys into two lookup categories based on jobs - either a number or a complex
 * monkey requiring a further calculation.
 * @param {string} monkeys - Raw monkey definitions
 * @returns {[Solutions, ComplexMonkeyDict]} Sorted monkeys as lookup objects
 */
const sortMonkeys = (monkeys: string[]): [Solutions, ComplexMonkeyDict] => {
  const solved: Solutions = {};
  const complexMonkeys: ComplexMonkeyDict = {};

  for (const monkey of monkeys) {
    const [name, job] = monkey.split(': ');
    if (!isNaN(+job)) solved[name] = +job;
    else complexMonkeys[name] = job.split(' ') as ComplexMonkey;
  }
  return [solved, complexMonkeys];
};

/**
 * Iteratively populates a Solutions object until all solutions are found.
 * @param {Solutions} solved - Lookup of monkeys with simple numbers as jobs
 * @param {ComplexMonkeyDict} complex - Lookup of monkeys with complex jobs requiring
 *    a calculation
 */
const populate = (solved: Solutions, complex: ComplexMonkeyDict) => {
  while (!('root' in solved)) {
    for (const [name, job] of Object.entries(complex)) {
      if (name in solved) continue;
      const [a, op, b] = job;
      if (a in solved && b in solved) {
        solved[name] = operations[op](solved[a], solved[b]);
      }
    }
  }
};

// PART 1
/**
 * Calculates the number assigned to a monkey
 * @param {string} monkeys - Raw monkey definitions
 * @param {string} [target='root'] - Name of the node of interest
 * @returns {number} The computed value of the target
 */
const solve = (monkeys: string[], target: string = 'root'): number => {
  const [solved, complex] = sortMonkeys(monkeys);
  populate(solved, complex);
  return solved[target];
};

// PART 2
/**
 * Finds what value the 'humn' monkey would have to shout to guarantee that
 * the 'root' monkey receives the same numbers on the right and left hand side.
 * This is done by replacing the value of the 'humn' node with NaN - this propagates
 * down the tree such that one of the two sides of 'root' will be NaN. We can then
 * look at that side and repeat the process, inverting each operation along the way.
 *
 * @param {string} monkeys - Raw monkey definitions
 * @returns {number} The required value of the 'humn' monkey
 */
const findHumn = (monkeys: string[]): number => {
  const [solved, complex] = sortMonkeys(monkeys);
  solved['humn'] = NaN;
  populate(solved, complex);
  const [lhs, _, rhs] = complex['root'];
  let target: string = isNaN(solved[lhs]) ? lhs : rhs;
  let curr: number = isNaN(solved[lhs]) ? solved[rhs] : solved[lhs];
  while (target !== 'humn') {
    const [a, op, b] = complex[target];
    target = isNaN(solved[a]) ? a : b;
    curr = isNaN(solved[a])
      ? invOperations[op](curr, solved[b], true)
      : invOperations[op](curr, solved[a], false);
  }
  return curr;
};

// RESULTS
console.log(`Part 1 solution: ${solve(monkeys)}`);
console.log(`Part 1 solution: ${findHumn(monkeys)}`);
