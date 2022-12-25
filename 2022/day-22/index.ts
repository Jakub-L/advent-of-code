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

class Map {
  /** Column */
  x: number = -1;
  /** Row */
  y: number = -1;
  /** Facing */
  f: number = 0;
  walls: Set<string> = new Set();
  space: Set<string> = new Set();
  /** Minimum and maximum indices for each row */
  rowMinMax: (number | undefined)[][] = [];
  /** Minimum and maximum indices for each column */
  colMinMax: (number | undefined)[][] = [];

  constructor(chars: string[][]) {
    for (let y = 0; y < chars.length; y++) {
      this.rowMinMax[y] = [undefined, chars[y].length - 1];
      for (let x = 0; x < chars[y].length; x++) {
        const char = chars[y][x];
        if (char !== ' ') {
          if (this.colMinMax[x] === undefined) this.colMinMax[x] = [];
          if (this.colMinMax[x][0] === undefined) this.colMinMax[x][0] = y;
          this.colMinMax[x][1] = y;
        }
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

  parseInstructions(instructions: Instruction[]) {
    for (const instruction of instructions) {
      if (typeof instruction === 'number') this.move(instruction);
      else this.rotate(instruction);
    }
  }

  rotate(dir: string) {
    do {
      this.f = (this.f + (dir === 'R' ? 1 : -1) + 4) % 4;
    } while (this.f < 0);
  }

  move(dist: number) {
    const [dx, dy] = facings[this.f];
    for (let i = 0; i < dist; i++) {
      const [x, y] = [this.x + dx, this.y + dy];
      if (this.walls.has(`${x},${y}`)) return;
      if (this.space.has(`${x},${y}`)) {
        this.x = x;
        this.y = y;
      } else {
        const [wrapX, wrapY] = this.wrap(x, y, dx, dy);
        if (this.walls.has(`${wrapX},${wrapY}`)) return;
        this.x = wrapX;
        this.y = wrapY;
      }
    }
  }

  get password(): number {
    return 1000 * (this.y + 1) + 4 * (this.x + 1) + this.f;
  }

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

// RESULTS
const m = new Map(chars);

m.parseInstructions(instructions);
console.log(m.password);
