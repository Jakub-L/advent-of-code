import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { Queue } from "@jakub-l/aoc-lib/data-structures";
import { sum } from "@jakub-l/aoc-lib/math";

// UTILS
type NumRange = { min: number; max: number };

class Brick {
  public x: NumRange;
  public y: NumRange;
  public z: NumRange;

  constructor(brickString: string) {
    const [a, b] = brickString.split("~");
    const [x1, y1, z1] = a.split(",").map(Number);
    const [x2, y2, z2] = b.split(",").map(Number);
    this.x = { min: Math.min(x1, x2), max: Math.max(x1, x2) };
    this.y = { min: Math.min(y1, y2), max: Math.max(y1, y2) };
    this.z = { min: Math.min(z1, z2), max: Math.max(z1, z2) };
  }

  toString(): string {
    return `${this.x.min},${this.y.min},${this.z.min}~${this.x.max},${this.y.max},${this.z.max}`;
  }
}

class Tower {
  /** Bricks that are part of the tower */
  public bricks: Brick[] = [];
  /** Map of x, y coodrinates (as string) to highest Z value and brick that occupies it */
  _towerTop: Map<string, [number, number]> = new Map();
  /** Array of which bricks support a given brick (i.e. _supportedBy[3] is the list of indeces that support bricks[3]) */
  _supportedBy: Set<number>[] = [];
  /** Array of which bricks are supported by a given brick (i.e. _supports[3] is the list of indeces that are supported by bricks[3]) */
  _supports: Set<number>[] = [];

  constructor(bricks: Brick[]) {
    this.bricks = bricks.sort((a, b) => a.z.min - b.z.min);
  }

  drop() {
    for (let i = 0; i < this.bricks.length; i++) {
      const brick = this.bricks[i];
      let supportedBy: Set<number> = new Set();
      let highestSeenZ = -1;
      for (let x = brick.x.min; x <= brick.x.max; x++) {
        for (let y = brick.y.min; y <= brick.y.max; y++) {
          const [highestZ, index] = this._getTop(x, y);
          if (highestZ + 1 > highestSeenZ) {
            highestSeenZ = highestZ + 1;
            supportedBy = new Set([index]);
          } else if (highestZ + 1 === highestSeenZ) supportedBy.add(index);
        }
      }

      const fallDistance = brick.z.min - highestSeenZ;
      if (fallDistance > 0) {
        brick.z.min -= fallDistance;
        brick.z.max -= fallDistance;
        this.bricks[i] = brick;
      }

      for (let x = brick.x.min; x <= brick.x.max; x++) {
        for (let y = brick.y.min; y <= brick.y.max; y++) {
          this._towerTop.set(`${x},${y}`, [brick.z.max, i]);
        }
      }
      supportedBy.delete(NaN);
      this._supportedBy.push(supportedBy);

      for (const supportingBrick of supportedBy) {
        if (!this._supports[supportingBrick]) this._supports[supportingBrick] = new Set();
        this._supports[supportingBrick].add(i);
      }
    }
  }

  getChainReaction(start: number) {
    const supportedByCount = this._supportedBy.map(supports => supports.size);
    // Even though we technically disintegrate the first brick, this is kind of
    // like a fall, in terms of behaviour. We have to set the fall count to -1
    // or else it would _actually_ count as a fall
    let fallCount = -1;
    const queue = new Queue<number>();
    queue.enqueue(start);
    while (!queue.isEmpty) {
      fallCount++;
      const brick = queue.dequeue();
      // For each Brick that is supported by this brick, decrement their support count
      // If the support count reaches 0, that means that the brick will fall.
      for (const supportedBrick of this._getSupportedBricks(brick)) {
        supportedByCount[supportedBrick]--;
        if (supportedByCount[supportedBrick] === 0) queue.enqueue(supportedBrick);
      }
    }
    return fallCount;
  }

  private _getTop(x: number, y: number): [number, number] {
    return this._towerTop.get(`${x},${y}`) || [0, NaN];
  }

  private _getSupportedBricks(i: number): Set<number> {
    return this._supports[i] ?? new Set<number>();
  }

  get removableBrickCount(): number {
    const unremovableBricks: Set<number> = new Set();
    for (let supports of this._supportedBy) {
      if (supports.size === 1) unremovableBricks.add(supports.values().next().value);
    }
    return this.bricks.length - unremovableBricks.size;
  }

  get chainReactionSum(): number {
    return sum(this._supportedBy.map((_, i) => this.getChainReaction(i)));
  }
}

// INPUT PROCESSING
// const input = `1,0,1~1,2,1
// 0,0,2~2,0,2
// 0,2,3~2,2,3
// 0,0,4~0,2,4
// 2,0,5~2,2,5
// 0,1,6~2,1,6
// 1,1,8~1,1,9`.split("\n");
const input = readFile(__dirname + "/input.txt") as string[];
const bricks = input.map(brick => new Brick(brick));
const tower = new Tower(bricks);
tower.drop();

// RESULTS
console.log(tower.removableBrickCount);
console.log(tower.chainReactionSum);

// console.log(tower._supportedBy);
// console.log(tower.bricks.map(brick => brick.toString()).join("\n"));
