import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

const input = readFile(__dirname + "/input.txt", ["\n", ""]) as string[][];

// const input = `...#......
// .......#..
// #.........
// ..........
// ......#...
// .#........
// .........#
// ..........
// .......#..
// #...#.....`
//   .split("\n")
//   .map(line => line.split(""));

class SkyMap {
  galaxies: number[][] = [];
  emptyRows: boolean[];
  emptyCols: boolean[];
  _spaceExpanded: boolean = false;

  constructor(image: string[][], private _expansionFactor: number = 2) {
    this.emptyRows = Array.from({ length: image.length }).fill(true) as boolean[];
    this.emptyCols = Array.from({ length: image[0].length }).fill(true) as boolean[];
    for (let row = 0; row < image.length; row++) {
      for (let col = 0; col < image[row].length; col++) {
        if (image[row][col] === "#") {
          this.emptyRows[row] = false;
          this.emptyCols[col] = false;
          this.galaxies.push([row, col]);
        }
      }
    }
  }

  _generateCumulativeShift(emptyLines: boolean[]) {
    return emptyLines.reduce((acc, isEmpty) => {
      const prev = acc.at(-1) ?? 0;
      acc.push(prev + (isEmpty ? (this._expansionFactor - 1) : 0));
      return acc;
    }, [] as number[]);
  }

  _expandSpace() {
    const cumulativeRowShift = this._generateCumulativeShift(this.emptyRows);
    const cumulativeColShift = this._generateCumulativeShift(this.emptyCols);
    this.galaxies = this.galaxies.map(([row, col]) => [row + cumulativeRowShift[row], col + cumulativeColShift[col]]);
    this._spaceExpanded = true;
  }

  _getShortestPathSum() {
    if (!this._spaceExpanded) this._expandSpace();
    const shortestPaths = [];
    for (let i = 0; i < this.galaxies.length; i++) {
      const [sourceRow, sourceCol] = this.galaxies[i];
      for (let j = i + 1; j < this.galaxies.length; j++) {
        const [targetRow, targetCol] = this.galaxies[j];
        const path = Math.abs(targetRow - sourceRow) + Math.abs(targetCol - sourceCol);
        shortestPaths.push(path);
      }
    }
    return sum(shortestPaths);
  }
}

const map = new SkyMap(input, 1_000_000);
console.log(map._getShortestPathSum());
