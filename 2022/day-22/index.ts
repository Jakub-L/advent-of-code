/**
 * Solution to Day 22 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/22
 */
import { readInput } from '../utils';

// INPUTS
const [rawChars, rawInstructions]: string[] = readInput('./day-22/input.txt', '\n\n');
// const [rawChars, rawInstructions]: string[] = `        ...#
//         .#..
//         #...
//         ....
// ...#.......#
// ........#...
// ..#....#....
// ..........#.
//         ...#....
//         .....#..
//         .#......
//         ......#.

// 10R5L5R10L4R5L5`.split('\n\n');

const chars: string[][] = rawChars.split('\n').map(r => r.split(''));
const instructions: Instruction[] = rawInstructions
  .split(/(L|R)/g)
  .map(e => (isNaN(+e) ? e : +e));

// UTILS
type Instruction = number | string;
const facings: number[][] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1]
];

/** Monkey map interpreted as a 2D flat map */
class Map2D {
  /** Column */
  x: number = -1;
  /** Row */
  y: number = -1;
  /** Facing */
  f: number = 0;
  /** Set of walls (impassable spaces) */
  walls: Set<string> = new Set();
  /** Set of empty spaces */
  space: Set<string> = new Set();
  /** Minimum and maximum indices for each row */
  rowMinMax: (number | undefined)[][] = [];
  /** Minimum and maximum indices for each column */
  colMinMax: (number | undefined)[][] = [];

  /**
   * Creates a new 2D monkey map
   * @param {string[][]} chars - Input map split into single-character length
   */
  constructor(chars: string[][]) {
    for (let y = 0; y < chars.length; y++) {
      this.rowMinMax[y] = [undefined, chars[y].length - 1];
      for (let x = 0; x < chars[y].length; x++) {
        const char = chars[y][x];
        // Find the minimum and maximum indices for this column
        if (char !== ' ') {
          if (this.colMinMax[x] === undefined) this.colMinMax[x] = [];
          if (this.colMinMax[x][0] === undefined) this.colMinMax[x][0] = y;
          this.colMinMax[x][1] = y;
        }
        // Find the minimum index for this row
        if (char !== ' ' && this.rowMinMax[y][0] === undefined) this.rowMinMax[y][0] = x;
        if (this.x < 0 && this.y < 0 && y === 0 && char !== ' ') {
          this.x = x;
          this.y = y;
        }
        if (char === '#') this.walls.add(`${x},${y}`);
        if (char === '.') this.space.add(`${x},${y}`);
      }
    }
  }

  /**
   * Parses an array of instructions and moves/rotates appropriately
   * @param {Instruction[]} instructions - Set of instruction
   */
  parseInstructions(instructions: Instruction[]) {
    for (const instruction of instructions) {
      if (typeof instruction === 'number') this.move(instruction);
      else this.rotate(instruction);
    }
  }

  /**
   * Changes the facing based on the rotation direction
   * @param {string} dir - Whether to move clockwise (R) or counterclockwise (L)
   */
  rotate(dir: string) {
    do {
      this.f = (this.f + (dir === 'R' ? 1 : -1) + 4) % 4;
    } while (this.f < 0);
  }

  /**
   * Moves a number of grid spaces along the map. Stops at walls.
   * @param {number} dist - Distance to move
   */
  move(dist: number) {
    const [dx, dy] = facings[this.f];
    for (let i = 0; i < dist; i++) {
      const [x, y] = [this.x + dx, this.y + dy];
      if (this.walls.has(`${x},${y}`)) break;
      if (this.space.has(`${x},${y}`)) {
        this.x = x;
        this.y = y;
      } else {
        const [wrapX, wrapY] = this.wrap(x, y, dx, dy);
        if (this.walls.has(`${wrapX},${wrapY}`)) break;
        this.x = wrapX;
        this.y = wrapY;
      }
    }
  }

  /** The final map password */
  get password(): number {
    return 1000 * (this.y + 1) + 4 * (this.x + 1) + this.f;
  }

  /**
   * Wraps the move around edges of a map
   * @param {number} x - Column after attempted move
   * @param {number} y - Row after attempted move
   * @param {number} dx - Column distance moved
   * @param {number} dy - Row distance moved
   * @returns {number[]} [x, y] after wrapping around edge
   */
  private wrap(x: number, y: number, dx: number, dy: number): number[] {
    let wrapX = x;
    let wrapY = y;
    if (dx === 0) {
      if (dy === 1) wrapY = this.colMinMax[x][0] as number;
      if (dy === -1) wrapY = this.colMinMax[x][1] as number;
    } else if (dy === 0) {
      if (dx === 1) wrapX = this.rowMinMax[y][0] as number;
      if (dx === -1) wrapX = this.rowMinMax[y][1] as number;
    }
    return [wrapX, wrapY];
  }
}

// PART 1
const flatMap = new Map2D(chars);
flatMap.parseInstructions(instructions);

// RESULTS
console.log(`Part 1 solution: ${flatMap.password}`);
console.log(`Part 2 solution: ${flatMap.password}`);
