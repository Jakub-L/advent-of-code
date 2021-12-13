/**
 * Solution to Day 13 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/13
 */
import { readInput } from '../utils';

// INPUTS
const [rawPoints, folds] = readInput('./../../inputs/day-13.txt', '\n\n').map(
  (e) => e.split('\n')
);
const points = rawPoints.map((pair) => pair.split(',').map(Number));

// UTILS
/** Class representing a transparent, dotted paper */
class Paper {
  dots: number[][];
  private rows: number;
  private cols: number;

  /**
   * Creates a new paper
   * @param {number[][]} points - Array of coordinates representing dot placements
   */
  constructor(points: number[][]) {
    const [cols, rows] = points.reduce(
      (acc, [x, y]) => [
        acc[0] <= x ? x + 1 : acc[0],
        acc[1] <= y ? y + 1 : acc[1]
      ],
      [0, 0]
    );
    this.rows = rows;
    this.cols = cols;
    this.dots = Array(rows)
      .fill(null)
      .map((row) => Array(cols).fill(0));
    points.forEach(([y, x]) => (this.dots[x][y] = 1));
  }

  /**
   * Folds a piece of paper in the specified direction
   * @param {string} instr - String instruction containing x/y and the line around which to fold
   */
  fold(instr: string) {
    let { dir, line } = instr.match(/(?<dir>x|y)=(?<line>\d+)/)?.groups || {};
    const [rows, cols] = dir === 'x' ? [this.rows, +line] : [+line, this.cols];
    const xFunc =
      dir === 'x'
        ? (x: number): number => Math.abs(x - this.cols + 1)
        : (x: number): number => x;
    const yFunc =
      dir === 'x'
        ? (y: number): number => y
        : (y: number): number => Math.abs(y - this.rows + 1);

    this.dots = Array(rows)
      .fill(null)
      .map((_, y) =>
        Array(cols)
          .fill(null)
          .map((_, x) => this.dots[y][x] || this.dots[yFunc(y)][xFunc(x)])
      );
    this.cols = cols;
    this.rows = rows;
  }

  /**
   * Converts the dot matrix to a string
   * @returns {string} String representation of the dot matrix
   */
  toString(): string {
    return this.dots
      .map((row) => row.map((c) => (c ? '█' : '░')).join(''))
      .join('\n');
  }

  /** Count of dots on the paper */
  get count(): number {
    return this.dots.flat().reduce((sum, e) => sum + e, 0);
  }
}

// PART 1
const paperOne = new Paper(points);
paperOne.fold(folds[0]);

// PART 2
const paperTwo = new Paper(points);
for (let fold of folds) paperTwo.fold(fold);

// OUTPUTS
console.log(`Part 1: ${paperOne.count}`);
console.log(`Part 2: \n${paperTwo.toString()}`);
