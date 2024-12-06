import { readFile } from "@jakub-l/aoc-lib/input-parsing";

type Coord = { x: number; y: number };
enum Dir {
  UP,
  RIGHT,
  DOWN,
  LEFT
}

const sample = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`
  .split("\n")
  .map(row => row.split(""));

const input: string[][] = readFile(__dirname + "/input.txt", ["\n", ""]) as string[][];

// Utils
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

class Lab {
  private _width: number;
  private _height: number;
  private _guard: Coord = { y: -1, x: -1 };
  private _direction: Dir = Dir.UP;
  public starting: Coord = { y: -1, x: -1 };
  public obstructions: Set<string> = new Set();
  public visited: Map<string, Set<Dir>> = new Map();
  public loops: boolean = false;

  constructor(map: string[][]) {
    this._height = map.length;
    this._width = map[0].length;
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const char = map[y][x];
        if (char === "#") this.obstructions.add(`${y},${x}`);
        if (char === "^") {
          this._guard = { y, x };
          this.starting = { y, x };
        }
      }
    }
  }

  private _isInBounds(): boolean {
    const { x, y } = this._guard;
    return y >= 0 && y < this._height && x >= 0 && x < this._width;
  }

  private _step() {
    const { y, x } = this._guard;
    const { y: dy, x: dx } = coord[this._direction];
    const newPos: Coord = { y: y + dy, x: x + dx };
    if (this.obstructions.has(id(newPos))) this._direction = turn[this._direction];
    else this._guard = newPos;
  }

  private _loops(): boolean {
    const location = id(this._guard);
    const locationDirs = this.visited.get(location) ?? new Set();
    return locationDirs.has(this._direction);
  }

  get potentialLoopObstacles(): string[] {
    return [...this.visited.keys()].filter(loc => loc !== id(this.starting));
  }

  patrol() {
    this._guard = this.starting;
    while (this._isInBounds()) {
      if (this._loops()) {
        this.loops = true;
        break;
      }
      const location = id(this._guard);
      const locationDirs = this.visited.get(location) ?? new Set();
      locationDirs.add(this._direction);
      this.visited.set(location, locationDirs);
      this._step();
    }
  }
}

// Part 2
const countLoops = (map: string[][], potential: string[]): number => {
  let loopCount = 0;
  for (const location of potential) {
    const newLab = new Lab(map);
    newLab.obstructions.add(location);
    newLab.patrol();
    if (newLab.loops) loopCount++;
  }

  return loopCount;
};

const lab = new Lab(input);
lab.patrol();
console.log(lab.visited.size);
console.log(countLoops(input, lab.potentialLoopObstacles));
