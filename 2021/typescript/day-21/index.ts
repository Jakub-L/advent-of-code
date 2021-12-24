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
const deterministicGame = (start: number[], win: number = 1000): number => {
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
/**
 * Plays a quantum game using a quantum dice and finds the number of wins for each player
 * @param {number[]} position - Positions of the two players on the board
 * @param {number[]} [score=[0,0]] - The current score of the two players
 * @param {Object} [cache={}] - The cached positions/scores and the number of wins they lead to
 * @param {number} [win=21] - The score needed for a win
 * @returns {number[]} Number of universes where, from the current position/score, each of
 *                     players wins
 */
const quantumGame = (
  position: number[],
  score: number[] = [0, 0],
  cache: { [index: string]: number[] } = {},
  win: number = 21
): number[] => {
  // prettier-ignore
  const moveCounts = [[3, 1], [4, 3], [5, 6], [6, 7], [7, 6], [8, 3], [9, 1]]
  const key = `${position.join(' ')} ${score.join(' ')}`;
  if (score[0] >= win) return [1, 0];
  if (score[1] >= win) return [0, 1];
  if (!(key in cache)) {
    console.log(key)
    let [w1, w2] = [0, 0];
    const [s1, s2] = score;
    const [p1, p2] = position;
    for (let [move, num] of moveCounts) {
      const newP1 = (p1 + move) % 10 || 10;
      // Swap the players to mimic the other player taking a move
      const [dW2, dW1] = quantumGame([p2, newP1], [s2, s1 + newP1], cache);
      w1 += num * dW1;
      w2 += num * dW2;
    }
    cache[key] = [w1, w2];
  }
  return cache[key];
};

// OUTPUTS
console.log(`Part 1: ${deterministicGame(start)}`);
console.log(`Part 2: ${Math.max(...quantumGame(start))}`);
