import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { prod } from "@jakub-l/aoc-lib/math";

// Types
type Coords = { x: number; y: number };
/** A robot */
type Robot = {
  /** The position of the robot */
  pos: Coords;
  /** The velocity of the robot in units per second */
  vel: Coords;
};

// Input
const input: string[] = readFile(`${__dirname}/input.txt`) as string[];

// Part 1 & 2
/** The area outside the bathrooms */
class BathroomArea {
  /** The width of the bathroom area */
  private _width: number;
  /** The height of the bathroom area */
  private _height: number;
  /** The robots in the bathroom area */
  private _robots: Robot[] = [];
  /** A table of x-y positions and the number of robots at that position */
  private _robotLookup: Record<string, number> = {};
  /** The time elapsed since the start of the simulation */
  public timeElapsed: number = 0;

  /**
   * Creates a new bathroom area
   * @param {string} robotDefs - The definitions of the robots in the bathroom area
   * @param {number} width - The width of the bathroom area
   * @param {number} height - The height of the bathroom area
   */
  constructor(robotDefs: string[], width: number, height: number) {
    this._width = width;
    this._height = height;
    for (const def of robotDefs) {
      const [x, y, vx, vy] = def.match(/[0-9-]+/g)!.map(Number);
      this._robots.push({ pos: { x, y }, vel: { x: vx, y: vy } });
    }
    this._refreshRobotLookup();
  }

  /** Recalculates the robot lookup table. */
  private _refreshRobotLookup(): void {
    this._robotLookup = this._robots.reduce((acc, { pos }) => {
      acc[`${pos.x},${pos.y}`] = (acc[`${pos.x},${pos.y}`] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Checks if there is a Christmas tree present at a given location.
   * The check assumes that a tree is formed with the following pattern
   * at its top (with 'A' being the point defined by x, y):
   *     A
   *    XXX
   *   XXXXX
   *  XXXXXXX
   * XXXXXXXXX
   * It is technically possible for this pattern to appear without the rest
   * of the tree, but it is considered unlikely enough to be ignored
   *
   * @param {number} x - The x-coordinate of the top of the tree
   * @param {number} y - The y-coordinate of the top of the tree
   * @returns {boolean} True if a tree is present at the given location, false otherwise
   */
  private _isTreePresent(x: number, y: number): boolean {
    for (let dy = 1; dy < 4; dy++) {
      for (let dx = -1; dx <= dy; dx++) {
        if (!this._robotLookup[`${x + dx},${y + dy}`]) return false;
      }
    }
    return true;
  }

  /**
   * Moves all robots in the bathroom area by the given number of seconds.
   * The robots are considred to be wrapping around each of the edges.
   * @param {number} [seconds=1] - The number of seconds to move the robots by
   * @returns {BathroomArea} The bathroom area after the robots have been moved
   */
  public step(seconds: number = 1): BathroomArea {
    this.timeElapsed += seconds;
    this._robots.forEach(robot => {
      robot.pos.x = (robot.pos.x + seconds * (robot.vel.x + this._width)) % this._width;
      robot.pos.y = (robot.pos.y + seconds * (robot.vel.y + this._height)) % this._height;
    });
    this._refreshRobotLookup();
    return this;
  }

  /**
   * Runs the simulation until a Christmas tree is found.
   * @returns {number} The number of seconds it took to find the tree
   */
  public findTree(): number {
    while (true) {
      this.step();
      for (const robot of this._robots) {
        if (this._isTreePresent(robot.pos.x, robot.pos.y)) return this.timeElapsed;
      }
    }
  }

  /** Returns a string representation of the bathroom area */
  public toString(): string {
    let str = "";
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        str += this._robotLookup[`${x},${y}`] || ".";
      }
      str += "\n";
    }
    return str;
  }

  /**
   * The safety factor of the bathroom area.
   * This is the product of the counts of robots in each quadrant of the area.
   * Any robot in the middle coordinate counts for no quadrant.
   */
  get safetyFactor(): number {
    const quadrantCounts = [0, 0, 0, 0];
    const halfWidth = Math.floor(this._width / 2);
    const halfHeight = Math.floor(this._height / 2);
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        if (x === halfWidth || y === halfHeight) continue;
        const val = this._robotLookup[`${x},${y}`] || 0;
        if (x < halfWidth) quadrantCounts[y < halfHeight ? 0 : 2] += val;
        else quadrantCounts[y < halfHeight ? 1 : 3] += val;
      }
    }
    return prod(quadrantCounts);
  }
}

// Results
const area = new BathroomArea(input, 101, 103).step(100);

console.log(`Part 1: ${area.safetyFactor}`);
console.log(`Part 2: ${area.findTree()}`);
