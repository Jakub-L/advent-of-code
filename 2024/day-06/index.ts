import { readFile } from "@jakub-l/aoc-lib/input-parsing";

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
const dirAfterTurn: Record<string, [number, number]> = {
  "-1,0": [0, 1],
  "0,1": [1, 0],
  "1,0": [0, -1],
  "0,-1": [-1, 0]
};

class Map {
  private _width: number;
  private _height: number;
  private _guard: [number, number] = [-1, -1];
  private _direction: [number, number] = [-1, 0];
  private _obstructions: Set<string> = new Set();
  private _loopObstructions: Set<string> = new Set();
  visited: Set<string> = new Set();

  constructor(map: string[][]) {
    this._height = map.length;
    this._width = map[0].length;
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        const char = map[row][col];
        if (char === "#") this._obstructions.add(`${row},${col}`);
        if (char === "^") this._guard = [row, col];
      }
    }
  }

  private _isInBounds(): boolean {
    return (
      this._guard[0] >= 0 &&
      this._guard[0] < this._height &&
      this._guard[1] >= 0 &&
      this._guard[1] < this._width
    );
  }

  private _turnRight() {
    this._direction = dirAfterTurn[this._direction.join(",")];
  }

  private _step() {
    const [r, c] = this._guard;
    const [dr, dc] = this._direction;
    const newPos: [number, number] = [r + dr, c + dc];
    if (this._obstructions.has(newPos.join(","))) this._turnRight();
    else this._guard = newPos;
  }

  private _checkLoopObstruction() {
    const [r, c] = this._guard;
    const [dr, dc] = dirAfterTurn[this._direction.join(",")];
    const potentialObstruction: string = `${r + dr},${c + dc}`;
    if (this.visited.has(this._guard.join(",")) && this.visited.has(potentialObstruction)) {
      this._loopObstructions.add(potentialObstruction);
    }
  }

  patrol() {
    while (this._isInBounds()) {
      this.visited.add(this._guard.join(","));
      this._checkLoopObstruction();
      this._step();
    }
    console.log(this._loopObstructions);
  }
}

const map = new Map(sample);
map.patrol();
console.log(map.visited.size);
