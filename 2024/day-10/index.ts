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

type Node = {
  x: number;
  y: number;
  height: number;
  parent: Node | null;
  children: Node[];
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

// Part 1 & 2
class Trail {
  public _head: Node;
  public _ends: Set<string> = new Set<string>();
  public _rating: number = 0;

  constructor(map: number[][], x: number, y: number) {
    this._head = { x, y, height: map[y][x], parent: null, children: [] };
    const queue = new Queue<Node>([this._head]);
    while (!queue.isEmpty) {
      const node = queue.dequeue();
      if (node.height === 9) {
        this._ends.add(`${node.x},${node.y}`);
        this._rating++;
      }
      for (const [dx, dy] of NEIGHBOURS) {
        const xx = node.x + dx;
        const yy = node.y + dy;
        if (map[yy]?.[xx] === node.height + 1) {
          const child = { x: xx, y: yy, height: map[yy][xx], parent: node, children: [] };
          node.children.push(child);
          queue.enqueue(child);
        }
      }
    }
  }

  public traverse() {
    const queue = new Queue<Node>([this._head]);
    while (!queue.isEmpty) {
      const node = queue.dequeue();
      console.log(`(${node.x}, ${node.y}): ${node.height}`);
      for (const child of node.children) {
        queue.enqueue(child);
      }
    }
  }

  get size(): number {
    return this._ends.size;
  }

  get rating(): number {
    return this._rating;
  }
}

class TopographicMap {
  public _trailheads: Trail[] = [];

  constructor(public map: number[][]) {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const height = map[y][x];
        if (height === 0) {
          const trail = new Trail(map, x, y);
          this._trailheads.push(trail);
        }
      }
    }
  }

  get sizes(): number[] {
    return this._trailheads.map(t => t.size);
  }

  get ratings(): number[] {
    return this._trailheads.map(t => t.rating);
  }
}

const map = new TopographicMap(input);
console.log(sum(map.sizes));
console.log(sum(map.ratings));
