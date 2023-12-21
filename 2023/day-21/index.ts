import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// UTILS
type Coords = [number, number];
const neighbours = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0]
];

/** An infnite garden to step through */
class Garden {
  /** The size of the grid. Assumes square grid */
  private _size: number;
  /** The starting position */
  private _start: Coords = [-1, -1];
  /** The layout of the garden */
  private _layout: string[][];

  /**
   * Creates a new Garden instance.
   * @param {string[][]} layout - The layout of the garden
   */
  constructor(layout: string[][]) {
    this._size = layout.length;
    this._layout = layout;
    for (let row = 0; row < this._size; row++) {
      for (let col = 0; col < this._size; col++) {
        if (layout[row][col] === "S") this._start = [row, col];
      }
    }
  }

  /**
   * Finds the number of occupied spaces after n steps. For smaller values of n, the
   * number of occupied spaces is calculated iteratively. For larger values of n, the
   * number of occupied spaces is extrapolated from the first three modular samples.
   * @param {number} [n=1] - The number of steps. Defaults to 1.
   * @returns {number} The number of occupied spaces after n steps
   */
  step(n: number = 1): number {
    const [rS, cS] = this._start;
    let positions: Set<string> = new Set([`${rS},${cS}`]);
    let samples: number[] = [];

    for (let i = 1; samples.length < 3 && i <= n; i++) {
      const newPositions = new Set<string>();
      for (const id of positions) {
        const [r, c] = id.split(",").map(Number);
        for (const [dr, dc] of neighbours) {
          // Actual positions for tracking explored space
          const [rr, cc] = [r + dr, c + dc];
          // Modulo positions used for checking obstacles
          const [mr, mc] = [(rr + 2 * this._size) % this._size, (cc + 2 * this._size) % this._size];
          if (this._layout[mr][mc] !== "#") newPositions.add(`${rr},${cc}`);
        }
      }
      positions = newPositions;
      if (i % this._size === n % this._size) samples.push(positions.size);
    }
    return samples.length === 3 ? this._extrapolate(samples, n) : positions.size;
  }

  /**
   * Extrapolates samples to find the number of occupied spaces after goal steps.
   *
   * If we are interested in the number of occupied spaces after some large number m steps,
   * we can generally see that the property grows quadratically (as the general growth is
   * in the shape of a square).
   *
   * Let f(n) be the number of spaces you can reach after n steps. Let X be the size of
   * the input grid. Then, f(n), f(n+X), f(n+2X), is quadratic. Let a0, a1 and a2 be the
   * sample values calculated iteratively.
   *
   * a0 = an0^2 + bn0 + c
   * a1 = an1^2 + bn1 + c
   * a2 = an2^2 + bn2 + c
   *
   * n0 = 0, n1 = 1, n2 = 2
   * a0 = c
   * a1 = a + b + a0
   *      -> b = a1 - a0 - a
   * a2 = 4a + 2b + a0
   *      -> a = (a2 - a0 - 2b) / 4
   *      -> a = (a2 - a0 - 2a1 + 2a0 + 2a) / 4
   *      -> a = (a2 + a0 - 2a1) / 4  + a/2
   *      -> a/2 = (a2 + a0 - 2a1) / 4
   *      -> a = (a2 + a0 - 2a1) / 2
   * @param {number[]} samples - First three samples of the quadratic function
   * @param {number} goal - The target number of steps
   * @returns {number} - The number of occupied spaces after goal steps
   */
  _extrapolate(samples: number[], goal: number): number {
    const [a0, a1, a2] = samples;
    const a = (a2 + a0 - 2 * a1) / 2;
    const b = a1 - a0 - a;
    const c = a0;
    const nm = Math.floor(goal / this._size);
    return a * nm ** 2 + b * nm + c;
  }
}

// INPUT PROCESSING
const input = readFile(__dirname + "/input.txt", ["\n", ""]) as string[][];
const garden = new Garden(input);

// RESULTS
console.log(`Part 1: ${garden.step(64)}`);
console.log(`Part 2: ${garden.step(26501365)}`);
