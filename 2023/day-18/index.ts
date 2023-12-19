import { readFile } from "@jakub-l/aoc-lib/input-parsing";

const input = readFile(__dirname + "/input.txt", ["\n", " "]) as string[][];

type Direction = "U" | "D" | "L" | "R";
type Instruction = { dir: Direction; dist: number };
const dirDelta = { U: [0, 1], D: [0, -1], L: [-1, 0], R: [1, 0] };

/**
 * Parses a regular instruction string into an instruction object.
 * @param {string[]} rawInstruction - Raw instruction strings in the format [direction, distance, hex]
 * @returns {Instruction} Parsed instruction
 */
const parseRegularInstruction = (rawInstruction: string[]): Instruction => {
  const [dir, dist] = rawInstruction;
  return { dir: dir as Direction, dist: Number(dist) };
};

/**
 * Parses an instruction object out of a "colour" hex code.
 * @param {string[]} rawInstruction - Raw instruction strings in the format [direction, distance, hex]
 * @returns {Instruction} Parsed instruction
 */
const parseHexInstruction = (rawInstruction: string[]): any => {
  const dirs = ["R", "D", "L", "U"];
  const hex = rawInstruction.at(-1)!.replaceAll(/\(|\)|#/g, "");
  return { dir: dirs[parseInt(hex.slice(-1))], dist: parseInt(hex.slice(0, -1), 16) };
};

/** A class representing a lagoon */
class Lagoon {
  /** The vertices of the lagoon */
  private _vertices: number[][] = [];
  /** The area of the lagoon, calculated by the shoelace formula */
  private _shoelaceArea: number = 0;
  /** The perimeter of the lagoon */
  private _perimeter: number = 0;

  /**
   * Digs the lagoon according to the given instructions.
   * @param {Instruction[]} instructions - The instructions to dig the lagoon
   * @returns {Lagoon} The lagoon itself, after digging
   */
  dig(instructions: Instruction[]): Lagoon {
    this._vertices = [];
    let [x, y] = [0, 0];
    for (const { dir, dist } of instructions) {
      const [dx, dy] = dirDelta[dir].map(d => d * dist);
      [x, y] = [x + dx, y + dy];
      this._vertices.push([x, y]);
    }
    this._shoelaceArea = this._getShoelaceArea();
    this._perimeter = this._getPerimeter();
    return this;
  }

  /**
   * Calculates the area of the lagoon using the shoelace formula.
   * @returns {number} The area of the lagoon, calculated by the shoelace formula
   */
  private _getShoelaceArea(): number {
    const len = this._vertices.length;
    let sum = 0;
    for (let i = 0; i < len; i++) {
      const [x1, y1] = this._vertices[i];
      const [x2, y2] = this._vertices[(i + 1) % len];
      sum += x1 * y2 - x2 * y1;
    }
    return Math.abs(sum) / 2;
  }

  /**
   * Calculates the perimeter of the lagoon.
   * @returns {number} The perimeter of the lagoon
   */
  private _getPerimeter(): number {
    const len = this._vertices.length;
    let sum = 0;
    for (let i = 0; i < len; i++) {
      const [x1, y1] = this._vertices[i];
      const [x2, y2] = this._vertices[(i + 1) % len];
      sum += Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
    return sum;
  }

  /**
   * The total count of grid points in the lagoon.
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

// INPUT PARSING
const instructions = input.map(parseRegularInstruction);
const hexInstructions = input.map(parseHexInstruction);
const lagoon = new Lagoon();

// RESULTS
console.log(`Part 1: ${lagoon.dig(instructions).lagoonSize}`);
console.log(`Part 2: ${lagoon.dig(hexInstructions).lagoonSize}`);
