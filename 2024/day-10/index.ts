import { Queue } from "@jakub-l/aoc-lib/data-structures";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

const NEIGHBOURS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1]
];

type MapLocation = {
  x: number;
  y: number;
  height: number;
};

const sample = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`
  .split("\n")
  .map(r => r.split("").map(e => (e === "." ? -1 : parseInt(e))));

const input: number[][] = readFile(`${__dirname}/input.txt`, ["\n", ""], Number) as number[][];

// Part 1

class TopographicMap {
  private _map: number[][];
  public _trailheads: MapLocation[][] = [];

  constructor(public map: number[][]) {
    this._map = map;
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const height = map[y][x];
        if (height === 0) this._trailheads.push([{ x, y, height }]);
      }
    }
    this._findTrails();
  }

  private _isInBounds(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this._map[0].length && y < this._map.length;
  }

  private _findTrails() {
    for (const trail of this._trailheads) {
      const queue = new Queue<MapLocation>([...trail]);
      const visited = new Set<string>();
      while (!queue.isEmpty) {
        const { x, y, height } = queue.dequeue();
        if (visited.has(`${x},${y}`)) continue;
        visited.add(`${x},${y}`);
        trail.push({ x, y, height });
        for (const [dx, dy] of NEIGHBOURS) {
          const xx = x + dx;
          const yy = y + dy;
          if (this._isInBounds(xx, yy) && this._map[yy][xx] === height + 1) {
            const next = { x: xx, y: yy, height: height + 1 };
            queue.enqueue(next);
          }
        }
      }
    }
  }

  get trailheadSizes(): number[] {
    return this._trailheads.map(t => t.filter(e => e.height === 9).length);
  }
}

const map = new TopographicMap(input);
console.log(sum(map.trailheadSizes));
