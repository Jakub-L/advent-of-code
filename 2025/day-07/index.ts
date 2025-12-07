import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

// Input
const input: string[][] = readFile(__dirname + "/input.txt", ["\n", ""]);

// Part 1 & 2
/** A tachyon manifold with splitters */
class Manifold {
  /** The column in which the beam starts */
  private startCol: number = -1;
  /** The columns containing splitters, grouped by row, top to bottom */
  private splitters: Array<Set<number>> = [];

  /**
   * Creates a tachyon manifold from raw input
   * @param rawInput - 2-D array of characters representing the manifold
   */
  constructor(rawInput: string[][]) {
    for (let row = 0; row < rawInput.length; row++) {
      const rowSplitters: Set<number> = new Set();
      for (let col = 0; col < rawInput[row].length; col++) {
        const char = rawInput[row][col];
        if (char === "S") this.startCol = col;
        if (char === "^") rowSplitters.add(col);
      }
      if (rowSplitters.size) this.splitters.push(rowSplitters);
    }
  }

  /** Fires a tachyon beam through the manifold
   * @returns An object containing:
   *          - The number of splits that occurred
   *          - The total number of timelines exiting the manifold
   */
  public fireBeam() {
    let splits = 0;
    let beams: Record<number, number> = { [this.startCol]: 1 };

    for (const splitterRow of this.splitters) {
      const newBeams: Record<number, number> = {};
      for (const [colString, timelines] of Object.entries(beams)) {
        const col = Number(colString);
        if (splitterRow.has(col)) {
          splits++;
          newBeams[col + 1] = (newBeams[col + 1] ?? 0) + timelines;
          newBeams[col - 1] = (newBeams[col - 1] ?? 0) + timelines;
        } else {
          newBeams[col] = (newBeams[col] ?? 0) + timelines;
        }
      }
      beams = newBeams;
    }

    return { splits, timelines: sum(Object.values(beams)) };
  }
}

// Results
const manifold = new Manifold(input);
const { splits, timelines } = manifold.fireBeam();

console.log(`Part 1: ${splits}`);
console.log(`Part 2: ${timelines}`);
