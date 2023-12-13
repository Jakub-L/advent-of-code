// const colReflection = `#.##..##.
// ..#.##.#.
// ##......#
// ##......#
// ..#.##.#.
// ..##..##.
// #.#.##.#.`
//   .split("\n")
//   .map(row => row.split(""));

import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

// const rowReflection = `#...##..#
// #....#..#
// ..##..###
// #####.##.
// #####.##.
// ..##..###
// #....#..#`
//   .split("\n")
//   .map(row => row.split(""));

const input = readFile(__dirname + "/input.txt", ["\n\n", "\n", ""]) as string[][][];

class Pattern {
  private _rowMap: string[];
  private _colMap: string[] = [];

  constructor(mirrorMap: string[][]) {
    this._rowMap = mirrorMap.map(row => row.join(""));
    this._colMap = mirrorMap[0].map((_, col) => mirrorMap.map(row => row[col]).join(""));
  }

  summary(lookForSmudge: boolean = false): number {
    const colLine = lookForSmudge ? this._findSmudgeLine(this._colMap) : this._findMirrorLine(this._colMap);
    const rowLine = lookForSmudge ? this._findSmudgeLine(this._rowMap) : this._findMirrorLine(this._rowMap);
    return colLine > 0 ? colLine : 100 * rowLine;
  }

  private _findMirrorLine(map: string[]): number {
    for (let i = 0; i < map.length - 1; i++) {
      if (this._isMirrorLine(map, i)) return i + 1;
    }
    return 0;
  }

  private _findSmudgeLine(map: string[]): number {
    for (let i = 0; i < map.length - 1; i++) {
      if (this._hasOneSmudge(map, i)) return i + 1;
    }
    return 0;
  }

  private _isMirrorLine(map: string[], line: number): boolean {
    for (let i = line, j = line + 1; i >= 0 && j < map.length; i--, j++) {
      if (map[i] !== map[j]) return false;
    }
    return true;
  }

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

// console.log(sum(input.map(mirrorMap => new Pattern(mirrorMap).summary())));
console.log(sum(input.map(mirrorMap => new Pattern(mirrorMap).summary(true))));
