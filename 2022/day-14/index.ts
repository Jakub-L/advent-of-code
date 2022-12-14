/**
 * Solution to Day 14 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/14
 */
import { readInput } from '../utils';

// INPUTS
const walls: Wall[] = readInput('./day-14/input.txt', '\n').map(wall =>
  wall.split(' -> ').map(coords => coords.split(',').map(Number) as Point)
);

// UTILS
type Point = [number, number];
type Wall = Point[];

/**
 * Normalizes a vector (makes its length 1)
 * @param {number[]} arr - Array of coordinates
 * @returns {number[]} Normalized input vector
 */
const normalize = (arr: number[]): number[] => {
  const length = Math.sqrt(arr.reduce((acc, coord) => acc + coord ** 2, 0));
  return arr.map(coord => coord / length);
};

/** A single Cave */
class Cave {
  /** Set of grid coordinates filled with sand */
  sand: Set<string> = new Set();
  /** Set of grid coordinates filled with rocks, hard platforms */
  private rocks: Set<string> = new Set();
  /** Y-coordinate of the lowest part of any wall in the cave */
  private lowestPlatform: number = 0;

  /**
   * Creates a new cave
   * @param {Wall[]} walls - A set of points defining the corners of a wall
   * @param {boolean} [hasFloor=false] - Whether the cave has a floor or endless void
   */
  constructor(walls: Wall[], hasFloor: boolean = false) {
    for (const wall of walls) this.parseWall(wall);
    if (hasFloor) {
      const floorY = this.lowestPlatform + 2;
      this.lowestPlatform = floorY;
      this.parseWall([
        [500 - floorY, floorY],
        [500 + floorY, floorY]
      ]);
    }
  }

  /**
   * Fills a cave with sand until no more sand can be added
   * @param {Point} start - Starting point for a grain of sand
   */
  fillWithSand(start: Point) {
    let prevSandCount = this.sand.size;
    let currSandCount;
    while (prevSandCount !== currSandCount) {
      prevSandCount = this.sand.size;
      this.dropGrain(start);
      currSandCount = this.sand.size;
    }
  }

  /**
   * Adds a wall to a cave as a series of grid points taken up by rock
   * @param {Wall} wall - Wall to add to cave
   */
  private parseWall(wall: Wall) {
    for (let i = 0; i < wall.length - 1; i++) {
      const [[x0, y0], [x1, y1]] = [wall[i], wall[i + 1]];
      const [dx, dy] = normalize([x1 - x0, y1 - y0]);
      let [x, y] = [x0, y0];
      while (x !== x1 || y !== y1) {
        this.rocks.add(`${x},${y}`);
        this.lowestPlatform = Math.max(this.lowestPlatform, y);
        x += dx;
        y += dy;
      }
      this.rocks.add(`${x},${y}`);
      this.lowestPlatform = Math.max(this.lowestPlatform, y);
    }
  }

  /**
   * Checks whether a grid point is occupied
   * @param {Point} p - Point to inspect
   * @returns {boolean} Whether the grid point is filled with sand or rock
   */
  private isOccupied(p: Point): boolean {
    return this.rocks.has(p.toString()) || this.sand.has(p.toString());
  }

  /**
   * Drops a single grain of sand into the cave at a specified position.
   * Attempts to go down first, then down-left, then down-right before coming to a rest.
   * @param {Point} start - Starting point for a grain of sand
   */
  private dropGrain(start: Point) {
    let [x, y] = start;
    let canMove = true;
    while (canMove) {
      if (y >= this.lowestPlatform) {
        break;
      } else if (!this.isOccupied([x, y + 1])) {
        y += 1;
      } else if (!this.isOccupied([x - 1, y + 1])) {
        x -= 1;
        y += 1;
      } else if (!this.isOccupied([x + 1, y + 1])) {
        x += 1;
        y += 1;
      } else {
        canMove = false;
        this.sand.add(`${x},${y}`);
      }
    }
  }
}

// PART 1
const firstCave = new Cave(walls);
firstCave.fillWithSand([500, 0]);

// PART 2
const secondCave = new Cave(walls, true);
secondCave.fillWithSand([500, 0]);

// RESULTS
console.log(`Part 1 solution: ${firstCave.sand.size}`);
console.log(`Part 2 solution: ${secondCave.sand.size}`);
