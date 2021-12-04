/**
 * Solution to Day 4 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/4
 */
import { readInput } from '../utils';

// INPUTS
const [drawRaw, ...boardsRaw] = readInput('./../../inputs/day-04.txt', '\n\n');
const draw = drawRaw.split(',').map(Number);
const boards = boardsRaw.map((board) =>
  board.split('\n').map((row) => row.trim().split(/\s+/).map(Number))
);

// UTILS
class Tile {
  row: number;
  col: number;
  marked: boolean;
  value: number;

  constructor(row: number, col: number, value: number) {
    this.row = row;
    this.col = col;
    this.value = value;
    this.marked = false;
  }
}

/** Class representing a single bingo board */
class BingoBoard {
  board: Array<Array<Tile>>;
  lookup: { [index: number]: Tile };

  /**
   * Generate a new bingo board
   * @param {Array.<Array.<number>>} board - the array of numbers representing the bingo card
   */
  constructor(board: Array<Array<number>>) {
    this.board = [];
    this.lookup = {};
    for (let [i, row] of board.entries()) {
      this.board.push([]);
      for (let [j, value] of row.entries()) {
        const tile = new Tile(i, j, value);
        this.board[i].push(tile);
        this.lookup[value] = tile;
      }
    }
  }

  /**
   * Check if a row has a Bingo
   * @param {number} row - The index of the row to check
   * @returns {boolean} True if all numbers in the row have been marked
   */
  checkRow(row: number): boolean {
    return this.board[row].every((tile) => tile.marked);
  }

  /**
   * Check if a column has a Bingo
   * @param {number} col - The index of the column to check
   * @returns {boolean} True if all numbers in the column have been marked
   */
  checkColumn(col: number): boolean {
    return this.board.every((row) => row[col].marked);
  }

  /**
   * Check both diagonals for bingo
   * @returns {boolean} True if either of the two diagonals are marked
   */
  checkDiagonals(): boolean {
    const diagonals = [
      Array(this.board.length)
        .fill(null)
        .map((_, i) => [i, i]),
      Array(this.board.length)
        .fill(null)
        .map((_, i, arr) => [i, arr.length - 1 - i])
    ];
    return diagonals.some((diagonal) =>
      diagonal.every(([i, j]) => this.board[i][j].marked)
    );
  }

  /**
   *
   * @param {number} num - The number to mark off
   * @returns {number|null} Score if the board won, else 0
   */
  markNumber(num: number): number {
    const tile = this.lookup[num];
    if (tile) {
      tile.marked = true;
      if (this.checkColumn(tile.col) || this.checkRow(tile.row)) {
        return (
          num *
          this.board.reduce(
            (sum, row) =>
              sum +
              row.reduce((acc, val) => acc + (val.marked ? 0 : val.value), 0),
            0
          )
        );
      }
    }
    return 0;
  }
}

/**
 * Plays bingo until a board wins or until the drawn numbers run out
 * @param {Array.<number>} draw - The numbers being drawn, in order
 * @param {Array.<BingoBoard>} boards - The bingo boards played
 * @returns {number} The score of the winning bingo board, 0 if no board won
 */
const playBingo = (draw: Array<number>, boards: Array<BingoBoard>): number => {
  for (let num of draw) {
    for (let board of boards) {
      const score = board.markNumber(num);
      if (score) return score;
    }
  }
  return 0;
};

// PART 1
const bingoBoards = boards.map((board) => new BingoBoard(board));
console.log(playBingo(draw, bingoBoards));

// PART 2

// Outputs
// console.log(draw);
// console.log(`Part 1: `);
// console.log(`Part 2: `);
