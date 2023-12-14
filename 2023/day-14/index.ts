import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

const input = readFile(__dirname + "/input.txt", ["\n", ""]) as string[][];

// const input = `O....#....
// O.OO#....#
// .....##...
// OO.#O....O
// .O.....O#.
// O.#..O.#.#
// ..O..#O..O
// .......O..
// #....###..
// #OO..#....`
//   .split("\n")
//   .map(l => l.split(""));

class Platform {
  private _layout: string[][];

  constructor(layout: string[][]) {
    this._layout = layout;
  }

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

  toString(): string {
    return this._layout.map(row => row.join("")).join("\n");
  }

  get totalLoad(): number {
    return sum(this._layout.map((row, i, arr) => (arr.length - i) * row.filter(c => c === "O").length));
  }
}

const p = new Platform(input);
p.rollNorth();
console.log(p.totalLoad);
