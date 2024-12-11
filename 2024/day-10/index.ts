import { Queue } from "@jakub-l/aoc-lib/data-structures";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

// Constants
const NEIGHBOURS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1]
];

// Types
/** A node of the trail */
type Node = {
  /** x-coordinate on the topographic map */
  x: number;
  /** y-coordinate on the topographic map */
  y: number;
  /** Elevation of the node */
  height: number;
  /** Children of the node */
  children: Node[];
};

// Input
const input: number[][] = readFile(`${__dirname}/input.txt`, ["\n", ""], Number) as number[][];

// Part 1 & 2
/** A single trail */
class Trail {
  /** The head of the trail, where the elevation is 0 */
  private _head: Node;
  /** Unique ends of the trail, where the elevation is 9 */
  private _ends: Set<string> = new Set<string>();
  /** Rating of the trail, representing paths between the head and ends */
  private _rating: number = 0;

  /**
   * Create a new trail.
   *
   * Traverses through the trail from the head to find all the paths
   * that can be followed.
   *
   * @param {number[][]} map - The topographic map
   * @param {number} x - x-coordinate of the head
   * @param {number} y - y-coordinate of the head
   */
  constructor(map: number[][], x: number, y: number) {
    this._head = { x, y, height: map[y][x], children: [] };
    const queue = new Queue<Node>([this._head]);
    while (!queue.isEmpty) {
      const node = queue.dequeue();
      if (node.height === 9) {
        this._ends.add(`${node.x},${node.y}`);
        this._rating++;
      }
      for (const [dx, dy] of NEIGHBOURS) {
        const [x, y] = [node.x + dx, node.y + dy];
        if (map[y]?.[x] === node.height + 1) {
          const child: Node = { x, y, height: map[y][x], children: [] };
          node.children.push(child);
          queue.enqueue(child);
        }
      }
    }
  }

  /**
   * The size of the trail. The number of unique 9-elevation locations that can
   * be reached from the head.
   */
  get size(): number {
    return this._ends.size;
  }

  /** The rating of the trail. The number of paths from the head any the ends. */
  get rating(): number {
    return this._rating;
  }
}

/** A topographic map */
class TopographicMap {
  /** The trailheads of the map */
  public _trails: Trail[] = [];

  /**
   * Create a new topographic map.
   *
   * @param {number[][]} map - The topographic map
   */
  constructor(map: number[][]) {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const height = map[y][x];
        if (height === 0) {
          const trail = new Trail(map, x, y);
          this._trails.push(trail);
        }
      }
    }
  }

  /** Array of sizes of each of the trails */
  get sizes(): number[] {
    return this._trails.map(t => t.size);
  }

  /** Array of ratings of each of the trails */
  get ratings(): number[] {
    return this._trails.map(t => t.rating);
  }
}

// Results
const map = new TopographicMap(input);
console.log(`Part 1: ${sum(map.sizes)}`);
console.log(`Part 2: ${sum(map.ratings)}`);
