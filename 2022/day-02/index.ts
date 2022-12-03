/**
 * Solution to Day 1 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/1
 */
import { readInput } from '../utils';

// INPUTS
const games: string[][] = readInput('./day-02/input.txt', '\n').map(game => game.split(' '));

// PART 1
/**
 * Scores a rock-paper-scissors game assuming the second part of the game is the move taken.
 * @param {string[]} game - A pair of letters represeting the rock-paper-scissor game
 * @returns {number} Sum of player's 2 move plus 0 for loss, 3 for draw and 6 for win
 */
const scoreAssumingMove = (game: string[]): number => {
  const moves = { X: 1, Y: 2, Z: 3, A: 1, B: 2, C: 3 };
  const [p1, p2] = game.map(letter => moves[letter as keyof typeof moves]);

  // Assuming 1 is rock, 2 is paper and 3 is scissors, then 1 loses against 2, 2 against 3 and 3
  // against 1. This equation converts P1's move to a move that would win against P2
  if (p1 === p2) return p2 + 3;
  else if (((p1 + 4) % 3) + 1 === p2) return p2;
  return p2 + 6;
};

// PART 2
/**
 * Scores a rock-paper-scissors game assuming the second part of the game is the result.
 * @param {string[]} game - A pair of letters represeting the rock-paper-scissor game
 * @returns {number} Sum of player's 2 move plus 0 for loss, 3 for draw and 6 for win
 */
const scoreAssumingResult = (game: string[]): number => {
  const moves = { A: 1, B: 2, C: 3 };
  const [p1, targetResult] = [moves[game[0] as keyof typeof moves], game[1]];
  if (targetResult === 'X') return ((p1 + 4) % 3) + 1; // Loss
  else if (targetResult === 'Y') return p1 + 3; // Draw
  else return ((p1 + 3) % 3) + 7; // Win
};

// RESULTS
console.log(`Solution to Part 1: ${games.map(scoreAssumingMove).reduce((acc, e) => acc + e, 0)}`);
console.log(`Solution to Part 2: ${games.map(scoreAssumingResult).reduce((acc, e) => acc + e, 0)}`);
