import { Counter } from "@jakub-l/aoc-lib/collections";
import { MinHeap } from "@jakub-l/aoc-lib/data-structures";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// Types
type Coord = { x: number; y: number };
type Node = { x: number; y: number; dist: number };

// Constants
// prettier-ignore
const DIR: [number, number][] = [[0, 1], [1, 0], [0, -1], [-1, 0]];

// Inputs
const sample = `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`
  .split("\n")
  .map(row => row.split(""));

const input: string[][] = readFile(`${__dirname}/input.txt`, ["\n", ""]) as string[][];

// Part 1
class Race {
  public _layout: string[][];
  public _start: Coord = { x: -1, y: -1 };
  public _end: Coord = { x: -1, y: -1 };
  public _track: Map<string, Node> = new Map();
  public _shortcuts: Map<string, number> = new Map();

  constructor(layout: string[][]) {
    this._layout = layout;
    for (let y = 0; y < layout.length; y++) {
      for (let x = 0; x < layout[y].length; x++) {
        if (layout[y][x] === "S") this._start = { x, y };
        if (layout[y][x] === "E") this._end = { x, y };
        if (layout[y][x] !== "#") this._track.set(`${x},${y}`, { x, y, dist: 0 });
      }
    }
    this._getDistances();
    this._findShortcuts();
  }

  private _getDistances(): void {
    const queue = new MinHeap<Node>([{ ...this._start, dist: 0 }], e => e.dist);
    const visited = new Set<string>();
    while (!queue.isEmpty) {
      const { x, y, dist } = queue.pop()!;
      const id = `${x},${y}`;
      if (visited.has(id)) continue;
      visited.add(id);
      this._track.set(id, { x, y, dist });
      for (const [dx, dy] of DIR) {
        const [nx, ny] = [x + dx, y + dy];
        if (this._track.has(`${nx},${ny}`)) {
          queue.add({ x: nx, y: ny, dist: dist + 1 });
        }
      }
    }
  }

  private _checkTrackForShortcut(start: Node): void {
    const { x, y } = start;
    const walls: Coord[] = [];
    for (const [dx, dy] of DIR) {
      const [nx, ny] = [x + dx, y + dy];
      if (!this._track.has(`${nx},${ny}`)) walls.push({ x: nx, y: ny });
    }
    for (const { x: wx, y: wy } of walls) {
      for (const [dx, dy] of DIR) {
        const [nx, ny] = [wx + dx, wy + dy];
        if (this._track.has(`${nx},${ny}`) && !(nx === x && ny === y)) {
          const end = this._track.get(`${nx},${ny}`)!;
          const saving = end.dist - start.dist - 2;
          if (saving > 0) {
            const id = `(${x},${y})->(${wx},${wy})`;
            if (!this._shortcuts.has(id) || this._shortcuts.get(id)! > saving) {
              this._shortcuts.set(id, saving);
            }
          }
        }
      }
    }
  }

  private _findShortcuts(): void {
    for (const startTrack of this._track.values()) {
      this._checkTrackForShortcut(startTrack);
    }
  }

  public shortcutCount(minSaving: number = 0): number {
    return [...this._shortcuts.values()].filter(saving => saving >= minSaving).length;
  }
}

// Results
const race = new Race(input);
console.log(race.shortcutCount(100))
