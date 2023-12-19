// const input = `R 6 (#70c710)
// D 5 (#0dc571)
// L 2 (#5713f0)
// D 2 (#d2c081)
// R 2 (#59c680)
// D 2 (#411b91)
// L 5 (#8ceee2)
// U 2 (#caa173)
// L 1 (#1b58a2)
// U 2 (#caa171)
// R 2 (#7807d2)
// U 3 (#a77fa3)
// L 2 (#015232)
// U 2 (#7a21e3)`
//   .split("\n")
//   .map(line => line.split(" "));

import { readFile } from "@jakub-l/aoc-lib/input-parsing";

const input = readFile(__dirname + "/input.txt", ["\n", " "]) as string[][];

type Direction = "U" | "D" | "L" | "R";
type Instruction = { dir: Direction; dist: number };
const dirDelta = { U: [0, 1], D: [0, -1], L: [-1, 0], R: [1, 0] };

const parseRegularInstruction = (rawInstruction: string[]): Instruction => {
  const [dir, dist] = rawInstruction;
  return { dir: dir as Direction, dist: Number(dist) };
};

const parseHexInstruction = (rawInstruction: string[]): any => {
  const dirs = ["R", "D", "L", "U"];
  const hex = rawInstruction.at(-1)!.replaceAll(/\(|\)|#/g, "");
  return { dir: dirs[parseInt(hex.slice(-1))], dist: parseInt(hex.slice(0, -1), 16) };
};

class Lagoon {
  private _points: number[][] = [];
  private _shoelaceArea: number = 0;
  private _perimeter: number = 0;

  dig(instructions: Instruction[]): Lagoon {
    this._points = [];
    let [x, y] = [0, 0];
    for (const { dir, dist } of instructions) {
      const [dx, dy] = dirDelta[dir].map(d => d * dist);
      [x, y] = [x + dx, y + dy];
      this._points.push([x, y]);
    }
    this._shoelaceArea = this._getShoelaceArea();
    this._perimeter = this._getPerimeter();
    return this;
  }

  private _getShoelaceArea(): number {
    const len = this._points.length;
    let sum = 0;
    for (let i = 0; i < len; i++) {
      const [x1, y1] = this._points[i];
      const [x2, y2] = this._points[(i + 1) % len];
      sum += x1 * y2 - x2 * y1;
    }
    return Math.abs(sum) / 2;
  }

  private _getPerimeter(): number {
    const len = this._points.length;
    let sum = 0;
    for (let i = 0; i < len; i++) {
      const [x1, y1] = this._points[i];
      const [x2, y2] = this._points[(i + 1) % len];
      sum += Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
    return sum;
  }

  /**
   * The total grid points in the lagoon.
   *
   * By Pick's theorem: A = i + b/2 - 1, wherre A is the area, i is the number of
   * grid points in the interior, and b is the number of grid points on the
   * boundary. We can find A by shoelace formula, and b by the perimeter. We're
   * interested in i, which we can find by rearranging the formula.
   *    i = A - b/2 + 1
   * However, the total number of grid points taken up by the lagoon is (i + b),
   * therefore the total number of grid points in the lagoon is:
   *    i + b = A - b/2 + 1 + b = A + b/2 + 1
   *
   * @returns {number} The total grid points in the lagoon.
   */
  get lagoonSize(): number {
    return this._shoelaceArea + this._perimeter / 2 + 1;
  }
}

const instructions = input.map(parseRegularInstruction);
const hexInstructions = input.map(parseHexInstruction);
const lagoon = new Lagoon();
lagoon.dig(instructions);
console.log(lagoon.lagoonSize);
lagoon.dig(hexInstructions);
console.log(lagoon.lagoonSize);
