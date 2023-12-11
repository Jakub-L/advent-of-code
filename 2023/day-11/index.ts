import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// const input = readFile(__dirname + '/input.txt', ["\n", ""])

const input = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`
  .split("\n")
  .map(line => line.split(""));

class SkyMap {
  galaxies: number[][] = [];
  emptyRows: boolean[];
  emptyCols: boolean[];

  constructor(image: string[][]) {
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
}

const map = new SkyMap(input);
console.log(map.galaxies);
console.log(map.galaxies[4], map.galaxies[8]);
