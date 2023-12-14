import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

/** Class representing a platform with rocks */
class Platform {
  /** Map of the rock positions */
  private _layout: string[][];

  /**
   * Create a platform
   * @param {string[][]} layout - 2D array of strings representing the
   *      rocks on the platform
   */
  constructor(layout: string[][]) {
    this._layout = layout;
  }

  /** Moves all the rocks north until they can't move any further */
  rollNorth() {
    let newLayout = this._layout;
    let updated;
    do {
      updated = false;
      for (let row = 1; row < newLayout.length; row++) {
        for (let col = 0; col < newLayout[row].length; col++) {
          if (newLayout[row][col] === "O" && newLayout[row - 1][col] === ".") {
            newLayout[row - 1][col] = "O";
            newLayout[row][col] = ".";
            updated = true;
          }
        }
      }
    } while (updated);
    this._layout = newLayout;
  }

  /**
   * Runs the platform for a given number of cycles and returns the total
   * load at the end
   * @param {number} target - The number of cycles to run the platform
   * @returns {number} The total load at the end of the cycles
   */
  cycle(target: number): number {
    const seenArrangements = new Map<string, number>();
    const loads = new Map<number, number>();
    for (let n = 1; n <= target; n++) {
      for (let i = 0; i < 4; i++) {
        this.rollNorth();
        this._rotateCW();
      }
      loads.set(n, this.totalLoad);
      const arrangement = this.toString();
      if (seenArrangements.has(arrangement)) {
        const previous = seenArrangements.get(arrangement)!;
        const loopLength = n - previous;
        const targetEquivalent = ((target - n) % loopLength) + previous;
        return loads.get(targetEquivalent)!;
      } else {
        seenArrangements.set(arrangement, n);
      }
    }
    return -1;
  }

  /** Returns a string representation of the platform */
  toString(): string {
    return this._layout.map(row => row.join("")).join("\n");
  }

  /** Rotates the platform clockwise */
  private _rotateCW() {
    this._layout = this._layout[0].map((_, col) => this._layout.map(row => row[col]).reverse());
  }

  /** Returns the total load on the platform */
  get totalLoad(): number {
    return sum(this._layout.map((row, i, arr) => (arr.length - i) * row.filter(c => c === "O").length));
  }
}

// INPUT SETUP
const input = readFile(__dirname + "/input.txt", ["\n", ""]) as string[][];
const platform = new Platform(input);
platform.rollNorth();

// RESULTS
console.log(`Part 1: ${platform.totalLoad}`);
console.log(`Part 1: ${platform.cycle(1_000_000_000)}`);
