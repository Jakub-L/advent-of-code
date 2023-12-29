import { readFile } from "@jakub-l/aoc-lib/input-parsing";

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
  /** Map of brick index to array of brick indices that support it */
  _supportedBy: Map<number, number[]> = new Map();

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

      this._supportedBy.set(i, Array.from(supportedBy));
    }
  }

  private _getTop(x: number, y: number): [number, number] {
    return this._towerTop.get(`${x},${y}`) || [0, NaN];
  }

  get removableBrickCount(): number {
    const unremovableBricks: Set<number> = new Set();
    for (let supports of this._supportedBy.values()) {
      if (supports.length === 1) unremovableBricks.add(supports[0]);
    }
    unremovableBricks.delete(NaN);
    return this.bricks.length - unremovableBricks.size;
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
// console.log(tower._supportedBy);
// console.log(tower.bricks.map(brick => brick.toString()).join("\n"));
