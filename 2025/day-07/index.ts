import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// Types
type Point = { x: number; y: number };

// Input
const input: string[][] = readFile(__dirname + "/input.txt", ["\n", ""]);
const testInput: string[][] = `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`
  .split("\n")
  .map(line => line.split(""));

// Part 1
class Manifold {
  startCol: number = -1;
  splitters: Array<Set<number>> = [];

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

  public fireBeam() {
    let splitCounter = 0;
    let beamCols = new Set<number>([this.startCol]);

    for (const splitter of this.splitters) {
      const splitBeams = new Set<number>();
      const uniqueBeams = new Set<number>();
      for (const col of beamCols) {
        if (splitter.has(col)) {
          splitCounter++;

          uniqueBeams.add(col - 1);
          uniqueBeams.add(col + 1);
        } else uniqueBeams.add(col);
      }
      beamCols = uniqueBeams;
    }
    return splitCounter;
  }
}

const manifold = new Manifold(input);

console.log(manifold.fireBeam());
