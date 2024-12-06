import { readFile } from "@jakub-l/aoc-lib/input-parsing";

type Coord = { x: number; y: number };
enum Dir {
  UP,
  RIGHT,
  DOWN,
  LEFT
}

const input: string[][] = readFile(__dirname + "/input.txt", ["\n", ""]) as string[][];

// Utils
/** Converts a coordinate to a <y,x> format ID */
const id = (c: Coord) => `${c.y},${c.x}`;

const coord: { [key in Dir]: Coord } = {
  [Dir.UP]: { y: -1, x: 0 },
  [Dir.RIGHT]: { y: 0, x: 1 },
  [Dir.DOWN]: { y: 1, x: 0 },
  [Dir.LEFT]: { y: 0, x: -1 }
};

const turn: { [key in Dir]: Dir } = {
  [Dir.UP]: Dir.RIGHT,
  [Dir.RIGHT]: Dir.DOWN,
  [Dir.DOWN]: Dir.LEFT,
  [Dir.LEFT]: Dir.UP
};

// Part 1
/** Class representing the lab */
class Lab {
  /** The width of the grid, number of columns */
  private _width: number;
  /** The height of the grid, number of rows */
  private _height: number;
  /** The guard's current position */
  private _position: Coord = { y: -1, x: -1 };
  /** The guard's current direction */
  private _direction: Dir = Dir.UP;
  /** The guard's starting position */
  private _startingPosition: Coord = { y: -1, x: -1 };
  /** Set of obstructions */
  public obstructions: Set<string> = new Set();
  /** Map of visited locations and the directions faced */
  public visited: Map<string, Set<Dir>> = new Map();
  /** Whether the guard loops */
  public loops: boolean = false;

  /**
   * Create a new lab.
   * @param {string[][]} map - The map of the lab
   */
  constructor(map: string[][]) {
    this._height = map.length;
    this._width = map[0].length;
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const char = map[y][x];
        if (char === "#") this.obstructions.add(`${y},${x}`);
        if (char === "^") {
          this._position = { y, x };
          this._startingPosition = { y, x };
        }
      }
    }
  }

  /**
   * Check if the guard is in bounds.
   * @returns {boolean} True if the guard is in bounds
   */
  private _isInBounds(): boolean {
    const { x, y } = this._position;
    return y >= 0 && y < this._height && x >= 0 && x < this._width;
  }

  /** Move the guard one step forward, or rotate them right if they can't move forward */
  private _step() {
    const { y, x } = this._position;
    const { y: dy, x: dx } = coord[this._direction];
    const newPos: Coord = { y: y + dy, x: x + dx };
    if (this.obstructions.has(id(newPos))) this._direction = turn[this._direction];
    else this._position = newPos;
  }

  /** Patrols the lab until the guard is out of bounds or loops */
  patrol() {
    this._position = this._startingPosition;
    while (this._isInBounds()) {
      const location = id(this._position);
      const locationDirs = this.visited.get(location) ?? new Set();
      if (locationDirs.has(this._direction)) {
        this.loops = true;
        return;
      }
      locationDirs.add(this._direction);
      this.visited.set(location, locationDirs);
      this._step();
    }
  }

  /** Potential locations where placing an obstacle might cause a loop */
  get possibleLoopLocations(): string[] {
    return [...this.visited.keys()].filter(loc => loc !== id(this._startingPosition));
  }
}

// Part 2
/**
 * Counts how many different loops could be caused by placing a single obstacle.
 *
 * Takes all the visited locations (excluding starting position) and places an
 * obstacle at each location. Then, it patrols the lab and checks if the guard
 * loops.
 *
 * @param {string[][]} map - The map of the lab
 * @param {string[]} possibleLoopLocations - Potential locations where placing an obstacle
 *        might cause a loop
 * @returns {number} The number of locations where placing an obstacle causes a loop
 */
const countLoops = (map: string[][], possibleLoopLocations: string[]): number => {
  let loopCount = 0;
  for (const location of possibleLoopLocations) {
    const newLab = new Lab(map);
    newLab.obstructions.add(location);
    newLab.patrol();
    if (newLab.loops) loopCount++;
  }

  return loopCount;
};

// Results
const lab = new Lab(input);
lab.patrol();
const { visited, possibleLoopLocations } = lab;

console.log(`Part 1: ${visited.size}`);
console.log(`Part 2: ${countLoops(input, possibleLoopLocations)}`);
