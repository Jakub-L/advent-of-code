/**
 * Solution to Day 9 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/9
 */
import { readInput } from '../utils';

// INPUTS
const moves: Move[] = readInput('./day-09/input.txt').map(parseInstruction);
// const moves: Move[] = `R 4
// U 4
// L 3
// D 1
// R 4
// D 1
// L 5
// R 2`
//   .split('\n')
//   .map(parseInstruction);

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
  head: Point = [0, 0];
  tail: Point = [0, 0];
  private allVisitedByTail: Point[] = [[0, 0]];
  private allVisitedByHead: Point[] = [[0, 0]];

  /**
   * Creates a new rope
   * @param {Move[]} moves - A list of moves to define the rope's movements
   */
  constructor(moves: Move[]) {
    for (const move of moves) {
      this.applyMove(move);
    }
  }

  /**
   * Moves the head, and if appropriate, the tail as well
   * @param {Move} move - Movement for the head to take
   */
  private applyMove(move: Move) {
    const [direction, distance] = move;
    const steps: { [index: string]: number[] } = {
      R: [1, 0],
      L: [-1, 0],
      U: [0, 1],
      D: [0, -1]
    };
    for (let i = 0; i < distance; i++) {
      this.head = this.head.map((pos, i) => pos + steps[direction][i]) as Point;
      this.moveTail();
      this.allVisitedByHead.push(this.head.slice() as Point);
      this.allVisitedByTail.push(this.tail.slice() as Point);
    }
  }

  get visitedByTail(): Point[] {
    return Object.values(
      this.allVisitedByTail.reduce((acc, point) => ({ ...acc, [point.toString()]: point }), {})
    );
  }

  /** Moves the tail if it gets too far from the head */
  private moveTail() {
    const [dx, dy] = this.head.map((coord, i) => coord - this.tail[i]);
    if (dx === 0 && Math.abs(dy) > 1) {
      this.tail[1] += Math.sign(dy);
    } else if (dy === 0 && Math.abs(dx) > 1) {
      this.tail[0] += Math.sign(dx);
    } else if (Math.abs(dx) + Math.abs(dy) > 2) {
      // When the tail needs to catch up diagonally, it moves into the space the head took up
      // after the previous move
      this.tail = this.allVisitedByHead[this.allVisitedByHead.length - 1].slice() as Point;
    }
  }
}

const r = new Rope(moves);
console.log(r.visitedByTail.length)
