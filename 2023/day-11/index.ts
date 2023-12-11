import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

// UTILS
/** Class representing the map of the sky */
class SkyMap {
  /** Array of [row, col] positions of the galaxies in the original image */
  private _imageGalaxyPositions: number[][] = [];
  /** Array of [row, col] positions of the galaxies accounting for space expansion */
  private _actualGalaxyPositions: number[][] = [];
  /** Array of booleans representing if a particular row is empty */
  private _isRowEmpty: boolean[];
  /** Array of booleans representing if a particular column is empty */
  private _isColumnEmpty: boolean[];

  /**
   * Creates a new SkyMap
   * @param {string[][]} image - An image of the sky, with hashes (#) representing a galaxy
   *    and full stops (.) representing empty space
   */
  constructor(image: string[][]) {
    this._isRowEmpty = Array.from({ length: image.length }).fill(true) as boolean[];
    this._isColumnEmpty = Array.from({ length: image[0].length }).fill(true) as boolean[];
    for (let row = 0; row < image.length; row++) {
      for (let col = 0; col < image[row].length; col++) {
        if (image[row][col] === "#") {
          this._isRowEmpty[row] = false;
          this._isColumnEmpty[col] = false;
          this._imageGalaxyPositions.push([row, col]);
        }
      }
    }
  }

  /**
   * Expands empty space by a given factor. Adjusts the actual positions of all
   * galaxies on the map to represent the space expansion.
   *
   * @param {number} [expansionFactor=2] - How much each empty space should occupy.
   *      Defaults to 2, meaning that each empty row or column is treated as 2.
   */
  expandSpace(expansionFactor: number = 2): SkyMap {
    const rowShift = this._getCumulativeShift(this._isRowEmpty, expansionFactor);
    const colShift = this._getCumulativeShift(this._isColumnEmpty, expansionFactor);
    this._actualGalaxyPositions = this._imageGalaxyPositions.map(([row, col]) => [
      row + rowShift[row],
      col + colShift[col]
    ]);
    return this;
  }

  /**
   * Converts an array of booleans representing if a given position is empty to an array of
   * cumulative shifts for each position.
   *
   * For example, if the output is [0, 0, 1, 1], it means that anything in the first two
   * positions should not be shifted, and anything in the last two positions should be shifted
   * by 1.
   *
   * @param {boolean[]} posShouldExpand - Array of booleans representing if a given position
   *     needs to be expanded (i.e. is empty)
   * @param {number} expansionFactor - Factor by which to expand the space
   * @returns {number[]} Array of cumulative shifts for each position
   */
  private _getCumulativeShift(posShouldExpand: boolean[], expansionFactor: number) {
    return posShouldExpand.reduce((acc, isEmpty) => {
      const prev = acc.at(-1) ?? 0;
      acc.push(prev + (isEmpty ? expansionFactor - 1 : 0));
      return acc;
    }, [] as number[]);
  }

  /**
   * Finds the shortest paths between all galaxy pairs and returns their sum.
   * Only counts each pair once, i.e. A to B is the same as B to A.
   */
  get shortestPathSum() {
    const shortestPaths = [];
    for (let i = 0; i < this._actualGalaxyPositions.length; i++) {
      const [sourceRow, sourceCol] = this._actualGalaxyPositions[i];
      for (let j = i + 1; j < this._actualGalaxyPositions.length; j++) {
        const [targetRow, targetCol] = this._actualGalaxyPositions[j];
        const path = Math.abs(targetRow - sourceRow) + Math.abs(targetCol - sourceCol);
        shortestPaths.push(path);
      }
    }
    return sum(shortestPaths);
  }
}

// INPUT PROCESSING
const input = readFile(__dirname + "/input.txt", ["\n", ""]) as string[][];
const map = new SkyMap(input);

// RESULTS
console.log(`Part 1: ${map.expandSpace().shortestPathSum}`);
console.log(`Part 2: ${map.expandSpace(1_000_000).shortestPathSum}`);
