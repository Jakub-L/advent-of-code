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

const sample = `5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`.split("\n");

// Part 1
class MemorySpace {
  private _width: number;
  private _height: number;
  private _start: Point = { x: 0, y: 0 };
  private _end: Point;
  private _allCorruptedBytes: string[];

  constructor(points: string[], width: number = 71, height: number = 71) {
    this._width = width;
    this._height = height;
    this._end = { x: width - 1, y: height - 1 };
    this._allCorruptedBytes = points;
  }

  private _isInBounds(x: number, y: number): boolean {
    return x >= 0 && x < this._width && y >= 0 && y < this._height;
  }

  public traverse(bytesFallen: number = 1024): number {
    const visited = new Set<string>();
    const corrupted = new Set<string>(this._allCorruptedBytes.slice(0, bytesFallen));
    const queue: MinHeap<MemoryNode> = new MinHeap([{ ...this._start, dist: 0 }], e => e.dist);

    while (!queue.isEmpty) {
      const { x, y, dist } = queue.pop()!;
      if (x === this._end.x && y === this._end.y) return dist;
      for (const [dx, dy] of DIR) {
        const [xx, yy] = [x + dx, y + dy];
        if (!this._isInBounds(xx, yy) || visited.has(`${xx},${yy}`) || corrupted.has(`${xx},${yy}`)) continue;
        visited.add(`${xx},${yy}`);
        queue.add({ x: xx, y: yy, dist: dist + 1 });
      }
    }
    return -1;
  }

  public firstBlockingByte(startingCount: number = 1024): string {
    console.log(this._allCorruptedBytes.length);
    for (let i = startingCount; i < this._allCorruptedBytes.length; i++) {
      if (this.traverse(i) === -1) return this._allCorruptedBytes[i - 1];
    }
    return "";
  }
}

// Results
const memorySpace = new MemorySpace(input);

// console.log(memorySpace.traverse()); // 334
console.log(memorySpace.firstBlockingByte());