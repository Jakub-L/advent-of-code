import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { Queue } from "@jakub-l/aoc-lib/data-structures";
import { sum } from "@jakub-l/aoc-lib/math";

// UTILS
/** A numerical range with a minium and maximum (inclusive of both) */
type NumRange = { min: number; max: number };

/** A single falling brick */
class Brick {
  /** Range of occupied x-values */
  public x: NumRange;
  /** Range of occupied y-values */
  public y: NumRange;
  /** Range of occupied z-values */
  public z: NumRange;

  /**
   * Create a new brick from a string
   * @param {string} brickString String in the format "x1,y1,z1~x2,y2,z2"
   */
  constructor(brickString: string) {
    const [a, b] = brickString.split("~");
    const [x1, y1, z1] = a.split(",").map(Number);
    const [x2, y2, z2] = b.split(",").map(Number);
    this.x = { min: Math.min(x1, x2), max: Math.max(x1, x2) };
    this.y = { min: Math.min(y1, y2), max: Math.max(y1, y2) };
    this.z = { min: Math.min(z1, z2), max: Math.max(z1, z2) };
  }
}

/** A tower of bricks */
class Tower {
  /** Bricks that are part of the tower */
  private _bricks: Brick[] = [];
  /** Map of x, y coodrinates (as string) to highest Z value and brick that occupies it */
  private _towerTop: Map<string, [number, number]> = new Map();
  /**
   * Array of which bricks support a given brick (i.e. _supportedBy[3] is the list of
   * indeces that support bricks[3])
   * */
  private _supportedBy: Set<number>[] = [];
  /**
   * Array of which bricks are supported by a given brick (i.e. _supports[3] is the list
   * of indeces that bricks[3] supports)
   */
  private _supports: Set<number>[] = [];

  /**
   * Create a new tower. Sorts the bricks from lowest z-value to highest
   * @param {Brick[]} bricks List of bricks
   */
  constructor(bricks: Brick[]) {
    this._bricks = bricks.sort((a, b) => a.z.min - b.z.min);
  }

  /**
   * Drops the bricks in the tower to the lowest possible position.
   */
  drop() {
    for (let i = 0; i < this._bricks.length; i++) {
      // First, we see what is the highest occupied Z value for the tower
      // for each x, y coordinate that the brick occupies. Using this, we
      // can find the bricks that support the current brick.
      const brick = this._bricks[i];
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

      // Now that we know the lowest position that could be occupied, we
      // lower the brick by changing its z-values.
      const fallDistance = brick.z.min - highestSeenZ;
      if (fallDistance > 0) {
        brick.z.min -= fallDistance;
        brick.z.max -= fallDistance;
      }

      // Now that we have lowered the brick, we can update the tower top
      // to include the newly-dropped brick
      for (let x = brick.x.min; x <= brick.x.max; x++) {
        for (let y = brick.y.min; y <= brick.y.max; y++) {
          this._towerTop.set(`${x},${y}`, [brick.z.max, i]);
        }
      }

      // Finally, we can update the set of bricks that support the dropped brick
      // as well as the sets of bricks that are supported by the dropped brick.
      // We remove 'NaN', as this represents the ground.
      supportedBy.delete(NaN);
      this._supportedBy.push(supportedBy);
      for (const supporting of supportedBy) {
        if (!this._supports[supporting]) this._supports[supporting] = new Set();
        this._supports[supporting].add(i);
      }
    }
  }

  /**
   * Gets the chain reaction length for a given brick. This is the total number of
   * bricks that will fall if the given brick is removed. This includes bricks
   * directly supporting by the starting brick, but also the bricks that were supported
   * by those bricks, and so on.
   * @param {number} start - The index of the brick
   * @returns {number} - The chain reaction length
   */
  private _getChainReaction(start: number) {
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

  /**
   * Gets the highest Z value and brick index for a given x, y coordinate
   * @param {number} x - The x coordinate
   * @param {number} y - The y coordinate
   * @returns {[number, number]} - The highest Z value and brick index that occupies it
   */
  private _getTop(x: number, y: number): [number, number] {
    return this._towerTop.get(`${x},${y}`) || [0, NaN];
  }

  /**
   * Gets the set of bricks that are supported by a given brick
   * @param {number} i - The index of the brick
   * @returns {Set<number>} - The set of bricks that are supported by the given brick
   */
  private _getSupportedBricks(i: number): Set<number> {
    return this._supports[i] ?? new Set<number>();
  }

  /** Gets the count of bricks that can be removed from a tower without causing any falls */
  get removableBrickCount(): number {
    const unremovableBricks: Set<number> = new Set();
    for (let supports of this._supportedBy) {
      if (supports.size === 1) unremovableBricks.add(supports.values().next().value);
    }
    return this._bricks.length - unremovableBricks.size;
  }

  /** Gets the sum of chain reaction lengths for each removed brick */
  get chainReactionSum(): number {
    return sum(this._supportedBy.map((_, i) => this._getChainReaction(i)));
  }
}

// INPUT PROCESSING
const bricks = (readFile(__dirname + "/input.txt") as string[]).map(str => new Brick(str));
const tower = new Tower(bricks);
tower.drop();

// RESULTS
console.log(`Part 1: ${tower.removableBrickCount}`);
console.log(`Part 2: ${tower.chainReactionSum}`);
