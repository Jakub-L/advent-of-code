/**
 * Solution to Day 9 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/9
 */
import { readInput } from '../utils';

// INPUTS
const moves: Move[] = readInput('./day-09/input.txt').map(parseInstruction);

// UTILS
type Move = [string, number];
type Point = [number, number];

/**
 * Parses an instruction string into a Move object
 * @param {string} instruction - String containing direction of move and distance to move
 * @returns {Move} Pair of direction and distance defining the move
 */
function parseInstruction(instruction: string): Move {
  const [direction, distance] = instruction.split(' ');
  return [direction, Number(distance)];
}

/** A single rope */
class Rope {
  segments: Point[];
  private _visitedByTail: { [index: string]: Point } = {};
  private moves = { U: [0, 1], D: [0, -1], R: [1, 0], L: [-1, 0] };

  /**
   * Creates a new rope
   * @param {number} length - Number of segments in the rope. Minimum 2 (head and tail)
   */
  constructor(length: number, moves: Move[]) {
    if (length < 2) throw RangeError('Length must be greater than 1');
    this.segments = Array.from({ length }, _ => new Array(2).fill(0) as Point);
    for (const move of moves) this.applyMove(move);
  }

  /**
   * Updates the position of a segment of the rope
   * @param {number} i - Index of the segment to update
   */
  updateSegmentPosition(i: number) {
    if (i < 1) throw RangeError('Index must be 1 or above');
    const [headX, headY] = this.segments[i - 1];
    const [tailX, tailY] = this.segments[i];
    const [dx, dy] = [headX - tailX, headY - tailY];
    if (dx === 0 && Math.abs(dy) > 1) {
      this.segments[i][1] += Math.sign(dy);
    } else if (dy === 0 && Math.abs(dx) > 1) {
      this.segments[i][0] += Math.sign(dx);
    } else if (Math.abs(dx) + Math.abs(dy) > 2) {
      this.segments[i][0] += Math.sign(dx);
      this.segments[i][1] += Math.sign(dy);
    }
  }

  /**
   * Moves the head of the rope and updates positions of all segments
   * @param {Move} move - Move to apply to the head of the rope
   */
  applyMove(move: Move) {
    const [direction, distance] = move;
    this._visitedByTail[this.tail.toString()] = this.tail;
    for (let n = 0; n < distance; n++) {
      const [dx, dy] = this.moves[direction as keyof typeof this.moves];
      this.head[0] += dx;
      this.head[1] += dy;
      for (let i = 1; i < this.length; i++) {
        this.updateSegmentPosition(i);
      }
      this._visitedByTail[this.tail.toString()] = this.tail;
    }
  }

  /** The length of the rope (number of segments) */
  get length() {
    return this.segments.length;
  }

  /** Head of the rope */
  get head() {
    return this.segments[0];
  }

  /** Tail of the rope */
  get tail() {
    return this.segments[this.length - 1];
  }

  /** Number of unique points visited by the tail */
  get numberVisitedByTail(): number {
    return Object.values(this._visitedByTail).length;
  }
}

// PART 1
const shortRope = new Rope(2, moves);

// PART 2
const longRope = new Rope(10, moves);

// RESULTS
console.log(`Part 1 solution: ${shortRope.numberVisitedByTail}`);
console.log(`Part 2 solution: ${longRope.numberVisitedByTail}`);
