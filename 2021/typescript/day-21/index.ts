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
function* deterministicDie() {
  let i = 0;
  while (true) {
    i = i + 3;
    yield ((i - 1) % 100) + ((i - 2) % 100) + ((i - 3) % 100) + 3;
  }
}

const game = (start: number[], win: number) => {
  const die = deterministicDie();
  let positions = Array.from(start);
  let scores = [0, 0];
  for (let i = 1; true; i++) {
    const rolls = [die.next().value, die.next().value].map(Number);
    positions = positions.map((num, i) => ((num + rolls[i]) % 10 || 10));
    const newScores = scores.map((score, i) => score + positions[i]);
    if (Math.max(...newScores) >= win)
      return { scores: [newScores[0], scores[1]], rollCount: i * 6 - 3 };
    scores = newScores;
  }
};

// PART 1

// PART 2

// OUTPUTS
let pos = [4, 8];
console.log(game(start, 1000));
// console.log(`Part 1: ${}`);
// console.log(`Part 2: ${}`);
