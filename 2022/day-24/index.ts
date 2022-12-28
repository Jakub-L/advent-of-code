/**
 * Solution to Day 24 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/24
 */
import { readInput } from '../utils';

// INPUTS
const initialValley: string[][] = readInput('./day-24/input.txt', '\n')
  .map(row => row.split(''));

// UTILS
type Point = [x: number, y: number];
type Dir = [dx: number, dy: number];

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

  /**
   * Updates the position of the blizzard
   * @param {number} xLimit - Maximum X-coordinate before wrapping
   * @param {number} yLimit - Maximum Y-coordinate before wrapping
   */
  update(xLimit: number, yLimit: number) {
    const [x, y] = this.pos;
    const [dx, dy] = this.mov;
    let [newX, newY] = [x + dx, y + dy];
    if (newX < 1) newX = xLimit - 1;
    else if (newX >= xLimit) newX = 1;
    if (newY < 1) newY = yLimit - 1;
    else if (newY >= yLimit) newY = 1;
    this.pos = [newX, newY];
  }
}

/** A valley of blizzards */
class Valley {
  /** Starting point */
  start: Point = [NaN, NaN];
  /** Ending point */
  end: Point = [NaN, NaN];
  /** Maximum X-value limited by the valley dimensions */
  xLimit: number;
  /** Maximum Y-value limited by the valley dimensions */
  yLimit: number;
  /** Array of blizzards in the valley */
  blizzards: Blizzard[] = [];
  /** Potential coordinates of visitable spaces (incl. blizzard positions) */
  spaces: Set<string> = new Set();

  /**
   * Creates a new valley
   * @param {string[][]} initialValley - 2D array of characters defining the initial
   *    valley conditions
   */
  constructor(initialValley: string[][]) {
    this.yLimit = initialValley.length - 1;
    this.xLimit = initialValley[0].length - 1;
    for (let y = 0; y < initialValley.length; y++) {
      for (let x = 0; x < initialValley[y].length; x++) {
        const char = initialValley[y][x];
        if (char in moves) this.blizzards.push(new Blizzard(x, y, char));
        if (char !== '#') this.spaces.add(`${x},${y}`);
        if (char === '.' && y === 0) this.start = [x, y];
        if (char === '.' && y === initialValley.length - 1) this.end = [x, y];
      }
    }
  }

  /**
   * Traverses the valley avoiding blizzard spaces.
   * @param {boolean} forgotSnacks - Whether we forgot snacks and need to go back for them.
   *    If set to true, the time returned will be the time needed for the entire
   *    start -> end -> start -> end trip.
   * @returns {number} Time taken for the trip
   */
  traverse(forgotSnacks: boolean = false): number {
    let time = 0;
    let trip = 0;
    let reachable: Map<string, Point> = new Map([[this.start.toString(), this.start]]);
    while (true) {
      // Update blizzards and find unavailable spaces
      this.blizzards.forEach(b => b.update(this.xLimit, this.yLimit));
      const impassible: Set<string> = this.blizzards.reduce(
        (acc, { pos }) => acc.add(pos.toString()),
        new Set() as Set<string>
      );
      let nextReachable: Map<string, Point> = new Map();

      // Find all non-blizzard points accessible in this tick
      for (const point of reachable.values()) {
        for (const move of this.getMoves(point)) {
          if (!impassible.has(move.toString())) {
            nextReachable.set(move.toString(), move);
          }
        }
      }

      if (trip === 0) {
        // First trip to the exit
        if (nextReachable.has(this.end.toString())) {
          // If we didn't forget snacks, this is the end of the traversal
          if (!forgotSnacks) return time + 1;
          trip++;
          nextReachable = new Map([[this.end.toString(), this.end]]);
        }
      } else if (trip === 1) {
        // Return to the start
        if (nextReachable.has(this.start.toString())) {
          trip++;
          nextReachable = new Map([[this.start.toString(), this.start]]);
        }
      } else {
        // Final trip to the exit
        if (nextReachable.has(this.end.toString())) return time + 1;
      }

      time++;
      reachable = nextReachable;
    }
  }

  /**
   * Finds all points that can be theoretically reached from point P, including itself.
   * Checks that the points lie within the accessible space, but does not check whether
   * the points are obstructed by blizzards.   *
   * @param {Pont} P - Point to inspect
   * @returns {Point[]} Array of points that can be reached from P
   */
  private getMoves([x, y]: Point): Point[] {
    return [[0, 0], [-1, 0], [0, -1], [1, 0], [0, 1]]
      .map(([dx, dy]) => [x + dx, y + dy] as Point)
      .filter(([x, y]) => this.spaces.has(`${x},${y}`));
  }
}

// PART 1
const part1 = new Valley(initialValley);

// PART 2
const part2 = new Valley(initialValley);

// RESULTS
console.log(`Part 1 solution: ${part1.traverse()}`);
console.log(`Part 2 solution: ${part2.traverse(true)}`);
