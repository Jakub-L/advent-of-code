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
const manhattan = (a: Coord, b: Coord): number => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

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

  private _isInBounds(x: number, y: number): boolean {
    return x >= 0 && x < this._layout[0].length && y >= 0 && y < this._layout.length;
  }

  private _findDistance(start: Coord, end: Coord): number {
    const queue = new MinHeap<Node>([{ ...start, dist: 0 }], e => e.dist);
    const visited = new Set<string>();
    while (!queue.isEmpty) {
      const { x, y, dist } = queue.pop()!;
      if (x === end.x && y === end.y) return dist;
      if (visited.has(`${x},${y}`)) continue;
      visited.add(`${x},${y}`);
      for (const [dx, dy] of DIR) {
        const [nx, ny] = [x + dx, y + dy];
        if (nx === end.x && ny === end.y) return dist + 1;
        if (this._isInBounds(nx, ny) && !this._track.has(`${nx},${ny}`)) {
          queue.add({ x: nx, y: ny, dist: dist + 1 });
        }
      }
    }

    return Infinity;
  }

  public findShortcuts(cheatLength: number): void {
    const sortedTrack = [...this._track.values()].sort((a, b) => a.dist - b.dist);
    for (let i = 0; i < sortedTrack.length; i++) {
      for (let j = i + 2; j < sortedTrack.length; j++) {
        const [start, end] = [sortedTrack[i], sortedTrack[j]];
        if (manhattan(start, end) > cheatLength) continue;
        const dist = this._findDistance(start, end);
        const saving = end.dist - start.dist - dist;
        const id = `(${start.x},${start.y})->(${end.x},${end.y})`;
        if (dist <= cheatLength && saving > 0) {
          this._shortcuts.set(id, saving);
        }
      }
    }
  }

  public debug(): void {
    const knowns = [50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76];
    const expected = [32, 31, 29, 39, 25, 23, 20, 19, 12, 14, 12, 22, 4, 3];
    const c = new Counter();
    for (const s of this._shortcuts.values()) c.add(s);
    for (let i = 0; i < knowns.length; i++) {
      console.log(
        `${knowns[i]} - Expected: ${expected[i]}, Found: ${c.get(knowns[i])} (${
          c.get(knowns[i]) === expected[i]
        })`
      );
    }
  }

  public shortcutCount(minSaving: number = 0): number {
    return [...this._shortcuts.values()].filter(saving => saving >= minSaving).length;
  }
}

// Results
const race = new Race(input);
// const race = new Race(sample);
// console.log(race._track.size)
race.findShortcuts(20);
console.log(race.shortcutCount(100));
// console.log(race.debug());
// console.log(race._shortcuts);
