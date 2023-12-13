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
  private _rowsAboveReflection: number = -1;
  private _columnsLeftOfReflection: number = -1;

  constructor(mirrorMap: string[][]) {
    this._rowMap = mirrorMap.map(row => row.join(""));
    this._colMap = mirrorMap[0].map((_, col) => mirrorMap.map(row => row[col]).join(""));
    this._columnsLeftOfReflection = this._findMirrorLine(this._colMap);
    if (this._columnsLeftOfReflection <= 0) this._rowsAboveReflection = this._findMirrorLine(this._rowMap);
  }

  private _findMirrorLine(map: string[]): number {
    for (let i = 0; i < map.length - 1; i++) {
      if (this._isMirrorLine(map, i)) return i + 1;
    }
    return 0;
  }

  private _isMirrorLine(map: string[], line: number): boolean {
    for (let i = line, j = line + 1; i >= 0 && j < map.length; i--, j++) {
      if (map[i] !== map[j]) return false;
    }
    return true;
  }

  get summary(): number {
    return this._columnsLeftOfReflection > 0 ? this._columnsLeftOfReflection : 100 * this._rowsAboveReflection;
  }
}

console.log(sum(input.map(mirrorMap => new Pattern(mirrorMap).summary)));

// console.log(new Pattern(input[0]).summary);
