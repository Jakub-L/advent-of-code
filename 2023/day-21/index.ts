import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// const input = `...........
// .....###.#.
// .###.##..#.
// ..#.#...#..
// ....#.#....
// .##..S####.
// .##..#...#.
// .......##..
// .##.#.####.
// .##..##.##.
// ...........`
//   .split("\n")
//   .map(line => line.split(""));

// UTILS
type Coords = [number, number];
const neighbours = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0]
];

class Garden {
  private _height: number;
  private _width: number;
  private _start: Coords = [-1, -1];
  private _stones: Map<string, Coords> = new Map();

  constructor(layout: string[][]) {
    this._height = layout.length;
    this._width = layout[0].length;
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        if (layout[y][x] === "S") this._start = [x, y];
        else if (layout[y][x] === "#") this._stones.set(`${x},${y}`, [x, y]);
      }
    }
  }

  step(n: number = 1) {
    const [xs, ys] = this._start;
    const stepHistory: Map<string, Coords>[] = [new Map([[`${xs},${ys}`, [xs, ys]]])];

    for (let i = 0; i < n; i++) {
      const lastStep = stepHistory.at(-1)!;
      const thisStep = new Map<string, Coords>();
      for (const [x, y] of lastStep.values()) {
        for (const [dx, dy] of neighbours) {
          const [xx, yy] = [x + dx, y + dy];
          if (xx < 0 || xx >= this._width || yy < 0 || yy >= this._height || this._stones.has(`${xx},${yy}`)) {
            continue;
          }
          thisStep.set(`${xx},${yy}`, [xx, yy]);
        }
      }
      stepHistory.push(thisStep);
    }
    return stepHistory.at(-1)?.size ?? -1;
  }
}

// INPUT PROCESSING
const input = readFile(__dirname + "/input.txt", ["\n", ""]) as string[][];
const garden = new Garden(input);
console.log(garden.step(64));
