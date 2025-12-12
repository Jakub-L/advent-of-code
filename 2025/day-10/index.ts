import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { gcd, sum } from "@jakub-l/aoc-lib/math";

// Types
type Diagram = {
  lights: string;
  buttons: number[][];
  joltage: number[];
};

// Input
const input: Diagram[] = readFile(__dirname + "/input.txt", ["\n"], parseDiagram);
const testInput = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`
  .split("\n")
  .map(parseDiagram);

function parseDiagram(str: string): Diagram {
  const [_, lights, buttonsStr, joltageStr] = /\[([.#]+)\] (.*) \{([\d,]+)\}/.exec(str)!;

  const buttons = buttonsStr
    .match(/\(([^)]+)\)/g)!
    .map(s => s.slice(1, -1).split(",").map(Number));
  const joltage = joltageStr.split(",").map(Number);

  return { lights, buttons, joltage };
}

// Part 1
const findMinimumPresses = (diagram: Diagram): number => {
  const buttonCount = diagram.buttons.length;
  let minimumPresses = Infinity;
  for (let i = 0; i < 2 ** buttonCount; i++) {
    const binaryMask = i.toString(2).padStart(buttonCount, "0").split("").map(Number);

    const lightToggles = binaryMask.reduce((acc, press, i) => {
      if (press === 0) return acc;
      const button = diagram.buttons[i];
      for (const light of button) acc[light] = (acc[light] ?? 0) + 1;
      return acc;
    }, Array(diagram.lights.length).fill(0));

    const lightState = lightToggles
      .map(toggleCount => (toggleCount % 2 === 1 ? "#" : "."))
      .join("");
    if (diagram.lights === lightState) {
      minimumPresses = Math.min(minimumPresses, sum(binaryMask));
    }
  }

  return minimumPresses;
};

// Part 2
class EquationSystem {
  coefficients: number[][] = [];
  counters: number[] = [];
  bounds: number[] = [];

  constructor(diagram: Diagram) {
    this.counters = diagram.joltage;
    this.coefficients = Array.from({ length: this.counters.length }, _ => []);
    for (const button of diagram.buttons) {
      const buttonSet = new Set(button);
      this.bounds.push(Math.min(...button.map(n => this.counters[n])));
      for (let i = 0; i < this.counters.length; i++) {
        this.coefficients[i].push(buttonSet.has(i) ? 1 : 0);
      }
    }
  }

  public _swapRows(i: number, j: number) {
    if (i >= this.coefficients.length || j >= this.coefficients.length) return;
    if (i === j) return;

    [this.coefficients[i], this.coefficients[j]] = [
      this.coefficients[j],
      this.coefficients[i]
    ];
    [this.counters[i], this.counters[j]] = [this.counters[j], this.counters[i]];
  }

  public _swapCols(i: number, j: number) {
    if (i >= this.coefficients[0].length || j >= this.coefficients[0].length) return;
    if (i === j) return;

    for (let k = 0; k < this.coefficients.length; k++) {
      [this.coefficients[k][i], this.coefficients[k][j]] = [
        this.coefficients[k][j],
        this.coefficients[k][i]
      ];
    }
    [this.bounds[i], this.bounds[j]] = [this.bounds[j], this.bounds[i]];
  }

  public _reduceRow(pivotRow: number, targetRow: number) {
    const x = this.coefficients[pivotRow][pivotRow];
    if (x === 0) return;
    const y = -this.coefficients[targetRow][pivotRow];
    const divisor = gcd(x, y);
    this.coefficients[targetRow] = this.coefficients[pivotRow].map(
      (_, col) =>
        (y * this.coefficients[pivotRow][col] + x * this.coefficients[targetRow][col]) /
        divisor
    );
    this.counters[targetRow] =
      (y * this.bounds[pivotRow] + x * this.bounds[targetRow]) / divisor;
  }
}

// console.log(findMinimumPresses(testInput[0]));
// console.log(findMinimumPresses(testInput[1]));
// console.log(findMinimumPresses(testInput[2]));
// console.log(sum(input.map(findMinimumPresses)));
const eq = new EquationSystem(testInput[0]);

console.log(eq.coefficients);
eq._swapCols(0, 3);
console.log(eq.coefficients);
