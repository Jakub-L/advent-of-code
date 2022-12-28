/**
 * Solution to Day 24 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/24
 */
import { readInput } from '../utils';

// INPUTS
// const initialValley: string[][] = readInput('./day-24/input.txt', '\n')
//   .map(row => row.slice(1, -1).split(''))
//   .slice(1, -1);
const initialValley: string[][] = `#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`
  .split('\n')
  .map(row => row.slice(1, -1).split(''))
  .slice(1, -1);

// UTILS
type Point = [x: number, y: number];
type Dir = [dx: number, dy: number];

// prettier-ignore
const moves: { [index: string]: Dir } = {
  '>': [1, 0], '<': [-1, 0],
  'v': [0, 1], '^': [0, -1]
}

/** A rolling blizzard */
class Blizzard {
  /** Current position of the blizzard */
  pos: Point;
  /** Movement every turn */
  private mov: Dir;

  /**
   * Creates a new blizzard
   * @param {number} x - X-coordinate
   * @param {number} y - Y-coordinate
   * @param {string} c - Character defining the blizzard
   */
  constructor(x: number, y: number, c: string) {
    this.pos = [x, y];
    this.mov = moves[c];
  }

  update(width: number, height: number) {
    const [x, y] = this.pos;
    const [dx, dy] = this.mov;
    let [newX, newY] = [x + dx, y + dy];
    if (newX < 0) newX = width - 1;
    else if (newX >= width) newX = 0;
    if (newY < 0) newY = height - 1;
    else if (newY >= height) newY = 0;
    this.pos = [newX, newY];
  }
}

class Valley {
  start: Point;
  end: Point;
  blizzards: Blizzard[] = [];
  width: number;
  height: number;

  constructor(initialValley: string[][]) {
    this.height = initialValley.length;
    this.width = initialValley[0].length;
    this.start = [0, -1];
    this.end = [this.width - 1, this.height];
    for (let y = 0; y < initialValley.length; y++) {
      for (let x = 0; x < initialValley[y].length; x++) {
        if (initialValley[y][x] in moves) {
          this.blizzards.push(new Blizzard(x, y, initialValley[y][x]));
        }
      }
    }
  }

  traverse(forgotSnacks: boolean = false) {
    let time = 0;
    let trip = 0;
    let reachable: Map<string, Point> = new Map([[this.start.toString(), this.start]]);
    while (true) {
      // Update blizzards and find unavailable spaces
      this.blizzards.forEach(b => b.update(this.width, this.height));
      const impassible: Set<string> = this.blizzards.reduce(
        (acc, { pos }) => acc.add(pos.toString()),
        new Set() as Set<string>
      );

      let nextReachable: Map<string, Point> = new Map();
      for (const point of reachable.values()) {
        for (const move of this.getMoves(point)) {
          if (!impassible.has(move.toString())) nextReachable.set(move.toString(), move);
        }
      }

      if (trip === 0) {
        if (nextReachable.has(this.end.toString())) {
          if (!forgotSnacks) return time + 1;
          trip++;
          nextReachable = new Map([[this.end.toString(), this.end]]);
        }
      } else if (trip === 1) {
        if (nextReachable.has(this.start.toString())) {
          console.log(time);
          trip++;
          nextReachable = new Map([[this.start.toString(), this.start]]);
        }
      } else {
        if (nextReachable.has(this.end.toString())) return time;
      }

      time++;
      reachable = nextReachable;
    }
  }

  private isValid([x, y]: Point): boolean {
    return (
      (x >= 0 && y >= 0 && x < this.width && y < this.height) ||
      (x === this.end[0] && y === this.end[1]) ||
      (x === this.start[0] && y === this.start[1])
    );
  }

  private getMoves([x, y]: Point): Point[] {
    return [
      [0, 0],
      [-1, 0],
      [0, -1],
      [1, 0],
      [0, 1]
    ]
      .map(([dx, dy]) => [x + dx, y + dy] as Point)
      .filter(p => this.isValid(p));
  }
}

// PART 1

// PART 2

// RESULTS
const v = new Valley(initialValley);
console.log(v.traverse());
console.log(v.traverse(true));
// console.log(v)
// console.log(v.blizzards.length);
