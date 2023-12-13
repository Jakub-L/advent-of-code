import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

const input = readFile(__dirname + "/input.txt", ["\n\n", "\n", ""]) as string[][][];

// UTILS
/** Class representing a single 2-D pattern */
class Pattern {
  /** The original pattern */
  private _rowMap: string[];
  /** The pattern transposed so that rows are columns */
  private _colMap: string[] = [];

  /**
   * Creates a new Pattern
   * @param {string[][]} mirrorMap - A 2-D array of hashes (#) and full stops (.)
   */
  constructor(mirrorMap: string[][]) {
    this._rowMap = mirrorMap.map(row => row.join(""));
    this._colMap = mirrorMap[0].map((_, col) => mirrorMap.map(row => row[col]).join(""));
  }

  /**
   * Calculates the summary of the pattern.
   * @param {boolean} [lookForSmudge=false] - Whether to look for a smudge.
   * @returns {number} The summary value of the pattern.
   */
  summary(lookForSmudge: boolean = false): number {
    const colLine = lookForSmudge ? this._findSmudgeLine(this._colMap) : this._findMirrorLine(this._colMap);
    const rowLine = lookForSmudge ? this._findSmudgeLine(this._rowMap) : this._findMirrorLine(this._rowMap);
    return colLine > 0 ? colLine : 100 * rowLine;
  }

  /**
   * Looks through the rows of a map to see if there is a mirror line
   * @param {string[]} map - The map to look through
   * @returns {number} The location of the mirror line, or 0 if none found
   */
  private _findMirrorLine(map: string[]): number {
    for (let i = 0; i < map.length - 1; i++) {
      if (this._isMirrorLine(map, i)) return i + 1;
    }
    return 0;
  }

  /**
   * Identifies a mirror line, assuming a single smudge is present
   * @param {string[]} map - The map to look through
   * @returns {number} The location of the mirror line, or 0 if none found
   */
  private _findSmudgeLine(map: string[]): number {
    for (let i = 0; i < map.length - 1; i++) {
      if (this._hasOneSmudge(map, i)) return i + 1;
    }
    return 0;
  }

  /**
   * Checks if a given line is a mirror line
   * @param {string[]} map - The map to look through
   * @param {number} line - The location to check
   * @returns {boolean} Whether the line is a mirror line
   */
  private _isMirrorLine(map: string[], line: number): boolean {
    for (let i = line, j = line + 1; i >= 0 && j < map.length; i--, j++) {
      if (map[i] !== map[j]) return false;
    }
    return true;
  }

  /**
   * Checks if a given line has a single smudge
   * @param {string[]} map - The map to look through
   * @param {number} line - The location to check
   * @returns {boolean} Whether the line has a single smudge
   */
  private _hasOneSmudge(map: string[], line: number): boolean {
    let smudgeFound = false;
    for (let i = line, j = line + 1; i >= 0 && j < map.length; i--, j++) {
      for (let k = 0; k < map[i].length; k++) {
        if (map[i][k] !== map[j][k]) {
          // If we already had a smudge, this is a second smudge, which is not allowed
          if (smudgeFound) return false;
          smudgeFound = true;
        }
      }
    }
    return smudgeFound;
  }
}

// RESULTS
console.log(`Part 1: ${sum(input.map(map => new Pattern(map).summary()))}`);
console.log(`Part 2: ${sum(input.map(map => new Pattern(map).summary(true)))}`);
