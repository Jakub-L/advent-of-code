/**
 * Solution to Day 17 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/17
 */
import { readInput } from '../utils';

// INPUTS
const gusts: number[] = readInput('./day-17/input.txt', '').map(char =>
  char === '>' ? 1 : -1
);
const rocks: Point[][] = [
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]],
  [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]],
  [[0, 0], [0, 1], [0, 2], [0, 3]],
  [[0, 0], [0, 1], [1, 0], [1, 1]]
];

// UTILS
type Point = [number, number];

/** Single rock in 2D space */
class Rock {
  points: Point[];

  /**
   * Creates a new rock
   * @param {number} index - Index of the rock in the array of all shapes
   * @param {number} x - Starting x-position
   * @param {number} y - Starting y-position
   */
  constructor(index: number, x: number, y: number) {
    this.points = rocks[index];
    this.move(x, y);
  }

  /**
   * Moves a rock to a particluar location
   * @param {number} dx - X distance to move (positive left)
   * @param {number} dy - Y distance to move (positive up)
   */
  move(dx: number, dy: number) {
    this.points = this.points.map(([x, y]) => [x + dx, y + dy]) as Point[];
  }

  /**
   * Checks whether the rock can move without bumping into either the chamber walls
   * or already settled rocks.
   * @param {number} dx - X distance to move (positive left)
   * @param {number} dy - Y distance to move (positive up)
   * @param {number} chamberWidth - Width of the chamber
   * @param {Set.<string>} filledSpaces - Set of already occupied spaces
   * @returns {boolean} Whether the rock can move by specified dx/dy
   */
  canMove(dx: number, dy: number, chamberWidth: number, filledSpaces: Set<string>): boolean {
    return this.points.every(
      ([x, y]) =>
        x + dx >= 0 &&
        x + dx < chamberWidth &&
        y + dy > 0 &&
        !filledSpaces.has(`${x + dx},${y + dy}`)
    );
  }

  /** Highest Y-coordinate of all points in the rock */
  get topY(): number {
    return this.points.reduce((acc, [_, y]) => Math.max(acc, y), -Infinity);
  }
}

/** Chamber into which rocks are dropped */
class Chamber {
  /** Index of the next rock */
  private rockIndex: number = 0;
  /** Index of the next gust */
  private gustIndex: number = 0;
  /** Set of coordinates occupied by rocks */
  private occupied: Set<string> = new Set();
  /** Cache of previously-seen states */
  private cache: { [index: string]: [number, number] } = {};
  /** Width of the chamber */
  private width: number;
  /** Default spawn positions w.r.t. (0, topY) */
  private spawnPos: Point;
  /** Highest Y coordinate in the tower */
  private topY: number = 0;
  /** Y coordinate value added through shortcutting */
  private addedY: number = 0;

  /**
   * Creates a new volcanic chamber
   * @param {number} width - Width of the chamber
   * @param {Point} spawnPos - Default spawn positions w.r.t. the top of the tower
   */
  constructor(width: number, spawnPos: Point) {
    this.width = width;
    this.spawnPos = spawnPos;
  }

  /**
   * Drops a number of rocks into the chamber
   * @param {number} n - Number of rocks to drop
   */
  dropRocks(n: number) {
    for (let i = 0; i < n; i++) {
      // Spawn a new rock at the correct position
      const [x, y] = this.spawnPos;
      const rock = new Rock(this.rockIndex, x, y + this.topY);
      let isMoving = true;
      while (isMoving) {
        // Move the rock with the wind and gravity until it can't move
        const dx = gusts[this.gustIndex];
        this.gustIndex = (this.gustIndex + 1) % gusts.length;
        if (rock.canMove(dx, 0, this.width, this.occupied)) rock.move(dx, 0);
        if (rock.canMove(0, -1, this.width, this.occupied)) rock.move(0, -1);
        else isMoving = false;
      }
      rock.points.forEach(([x, y]) => this.occupied.add(`${x},${y}`));
      this.topY = Math.max(this.topY, rock.topY);
      this.rockIndex = (this.rockIndex + 1) % rocks.length;
      // Unique key used for caching
      const key = `${this.gustIndex} - ${this.rockIndex} - ${this.state}`;
      if (key in this.cache) {
        // Iteration at which the key was last seen and the height at that time
        const [prevI, prevY] = this.cache[key];
        // Length of repeat cycle and change in height at that cycle
        const [dI, dY] = [i - prevI, this.topY - prevY];
        // How many times the cycle can be squeezed into remaining iterations
        const repeats = Math.floor((n - i) / dI);
        // The Y added through shortcutting is kept separate, since the tower isn't
        // actually this tall. We're just holding the added height in a virtual
        // counter.
        this.addedY += repeats * dY;
        i += repeats * dI;
      }
      this.cache[key] = [i, this.topY];
    }
  }

  /** Height of the total tower */
  get height() { return this.topY + this.addedY }

  /** State of the tower, defined by top 30 rows of occupied spaces */
  private get state(): string {
    const result: string[] = [];
    for (let y = this.topY; y > this.topY - 30; y--) {
      for (let x = 0; x < this.width; x++) {
        if (this.occupied.has(`${x},${y}`)) result.push(`${x},${this.topY - y}`);
      }
    }
    return result.sort().join('|');
  }
}

// PART 1
const part1 = new Chamber(7, [2, 4]);
part1.dropRocks(2022);

// PART 2
const part2 = new Chamber(7, [2, 4]);
part2.dropRocks(1_000_000_000_000);

// RESULTS
console.log(`Part 1 solution: ${part1.height}`)
console.log(`Part 2 solution: ${part2.height}`)