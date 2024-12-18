import { MinHeap } from "@jakub-l/aoc-lib/data-structures";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// Types & enums
type Point = { x: number; y: number };
type MemoryNode = Point & { dist: number };

// Constants
// prettier-ignore
const DIR: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]]

// Input
const input: string[] = readFile(`${__dirname}/input.txt`) as string[];

// Part 1
/** A space in memory with falling bytes */
class MemorySpace {
  /** The width of the space */
  private _width: number;
  /** The height of the space */
  private _height: number;
  /** The starting point from which traversal will happen. Top-left of the space. */
  private _start: Point = { x: 0, y: 0 };
  /** The ending point to which traversal must be reached. Bottom-right of the space. */
  private _end: Point;
  /** All locations where a byte will fall, as <X,Y> strings */
  private _allCorruptedBytes: string[];

  /**
   * Creates a new MemorySpace
   * @param {string[]} points - All locations where a byte will fall, as <X,Y> strings
   * @param {number} [width=71] - The width of the space, default 71 (for X ranges from 0 to 70)
   * @param {number} [height=71] - The height of the space, default 71 (for Y ranges from 0 to 70)
   */
  constructor(points: string[], width: number = 71, height: number = 71) {
    this._width = width;
    this._height = height;
    this._end = { x: width - 1, y: height - 1 };
    this._allCorruptedBytes = points;
  }

  /**
   * Checks if a point is within bounds of the space.
   * @param {number} x - The X coordinate
   * @param {number} y - The Y coordinate
   * @returns {boolean} True if the point is within bounds, false otherwise
   */
  private _isInBounds(x: number, y: number): boolean {
    return x >= 0 && x < this._width && y >= 0 && y < this._height;
  }

  /**
   * Traverses the space from the start to the finish and returns the number
   * of steps taken. Uses Dijkstra's algorithm.
   * @param {number} [bytesFallen=1024] - The number of bytes that have fallen at the
   *            start of the traversal. Default 1024.
   * @returns {number} The number of steps taken to reach the end, or -1 if the end
   *            is unreachable.
   */
  public traverse(bytesFallen: number = 1024): number {
    const visited = new Set<string>();
    const corrupted = new Set<string>(this._allCorruptedBytes.slice(0, bytesFallen));
    const queue: MinHeap<MemoryNode> = new MinHeap([{ ...this._start, dist: 0 }], e => e.dist);

    while (!queue.isEmpty) {
      const { x, y, dist } = queue.pop()!;
      if (x === this._end.x && y === this._end.y) return dist;
      for (const [dx, dy] of DIR) {
        const [xx, yy] = [x + dx, y + dy];
        if (this._isInBounds(xx, yy) && !visited.has(`${xx},${yy}`) && !corrupted.has(`${xx},${yy}`)) {
          visited.add(`${xx},${yy}`);
          queue.add({ x: xx, y: yy, dist: dist + 1 });
        }
      }
    }
    return -1;
  }

  /**
   * Finds the first byte location that blocks the traversal of the space. Uses binary search.
   * 
   * @param {number} [startingCount=1024] - The number of bytes that have fallen at the
   *            start of the search. Default 1024, since from part 1 we know that the end is
   *            reachable with 1024 bytes fallen.
   * @returns {string} The first byte that blocks the traversal, as a <X,Y> string.
   */
  public firstBlockingByte(startingCount: number = 1024): string {
    let [lower, upper] = [startingCount, this._allCorruptedBytes.length];
    while (upper > lower) {
      const i = Math.floor((upper + lower) / 2);
      if (this.traverse(i) === -1) upper = i;
      else lower = i + 1;
    }
    return this._allCorruptedBytes[lower - 1];
  }
}

// Results
const memorySpace = new MemorySpace(input);
console.log(`Part 1: ${memorySpace.traverse()}`)
console.log(`Part 2: ${memorySpace.firstBlockingByte()}`)
