/**
 * Solution to Day 21 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/21
 */
import { readInput } from '../utils';

// TYPES

// INPUTS
const start = readInput('./../../inputs/day-21.txt')
  .map((str) => (/\d+$/.exec(str) || [])[0])
  .map(Number);

// UTILS

// PART 1
/**
 * Generates the sum of the next three rolls of the deterministic die. It is a 100-sided
 * die that always generates numbers in order (1, 2, 3...) wrapping around from 100 to 1.
 * @yields {number} The sum of the next three rolls
 */
function* deterministicDie(): Generator {
  let i = 0;
  while (true) {
    i = i + 3;
    yield ((i - 1) % 100) + ((i - 2) % 100) + ((i - 3) % 100) + 3;
  }
}

/**
 * Plays a game with a deterministic die until a given score is reached. Returns the solution
 * to Part 1 of the day's challenge
 * @param {number[]} start - The starting positions of both players
 * @param {number} win - The score needed for a termination of the game. Must be exceeed or
 *                       equalled. 
 * @returns {number} The product of the losing player's score and the number of dice rolls
 *                   needed for a win
 */
const deterministicGame = (start: number[], win: number): number => {
  const die = deterministicDie();
  let [p1, p2] = start;
  let [s1, s2] = [0, 0];
  for (let i = 1; true; i++) {
    const [r1, r2] = [die.next().value, die.next().value].map(Number);
    [p1, p2] = [(p1 + r1) % 10 || 10, (p2 + r2) % 10 || 10];
    if (s1 + p1 >= win) return s2 * (6 * i - 3);
    [s1, s2] = [s1 + p1, s2 + p2];
  }
};

// PART 2

// OUTPUTS
console.log(`Part 1: ${deterministicGame(start, 1000)}`);
// console.log(`Part 2: ${}`);
