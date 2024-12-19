import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

// Constants
const DIR: Record<string, { dx: number; dy: number }> = {
  "^": { dx: -1, dy: 0 },
  v: { dx: 1, dy: 0 },
  "<": { dx: 0, dy: -1 },
  ">": { dx: 0, dy: 1 }
};

// Types
type WarehouseLayout = string[][];
type Instructions = string[];

// Input
/**
 * Converts the input string into a tuple of warehouse layout and instructions
 * @param {string[]} input - Input string
 * @returns {[WarehouseLayout, Instructions]} Tuple of warehouse layout and instructions
 */
const parseInput = (input: string[]): [WarehouseLayout, Instructions] => {
  const [rawLayout, rawInstructions] = input;
  return [
    rawLayout.split("\n").map(row => row.split("")),
    rawInstructions.split("").filter(i => i !== "\n")
  ];
};

const [layout, instructions] = parseInput(readFile(`${__dirname}/input.txt`, ["\n\n"]));

// Part 1 & 2
/**
 * Doubles the width of the warehouse layout
 * @param {WarehouseLayout} layout - The original warehouse layout
 * @returns {WarehouseLayout} The warehouse layout with doubled width
 */
const doubleWidth = (layout: WarehouseLayout): WarehouseLayout => {
  const newLayout: WarehouseLayout = [];
  for (let y = 0; y < layout.length; y++) {
    const row = [];
    for (let x = 0; x < layout[y].length; x++) {
      const char = layout[y][x];
      if (char === "#") row.push("#", "#");
      else if (char === "O") row.push("[", "]");
      else row.push(char, ".");
    }
    newLayout.push(row);
  }
  return newLayout;
};

/**
 * Processes through instructions and moves the robot accordingly
 * @param {WarehouseLayout} layout - The starting warehouse layout
 * @param {Instructions} instructions - The instructions for the robot
 * @returns {number} The sum of GPS coordinates
 */
const solve = (layout: WarehouseLayout, instructions: Instructions): number => {
  const [width, height] = [layout[0].length, layout.length];

  // Find the robot
  let [rx, ry] = [-1, -1];
  for (let x = 0; x < height; x++) {
    for (let y = 0; y < width; y++) {
      if (layout[x][y] === "@") {
        [rx, ry] = [x, y];
        break;
      }
    }
  }

  // Iterate through the instructions
  for (const instr of instructions) {
    const { dx, dy } = DIR[instr];
    const toMove = [[rx, ry]];
    const inspected = new Set<string>(`${rx},${ry}`);
    let isImpossible = false;
    for (let i = 0; i < toMove.length; i++) {
      const [x, y] = toMove[i];
      const [nx, ny] = [x + dx, y + dy];
      const char = layout[nx][ny];
      if (char === "#") {
        isImpossible = true;
        break;
      }
      if (["[", "]", "O"].includes(char)) {
        if (!inspected.has(`${nx},${ny}`)) {
          toMove.push([nx, ny]);
          inspected.add(`${nx},${ny}`);
        }
        if (char === "[" && !inspected.has(`${nx},${ny + 1}`)) {
          toMove.push([nx, ny + 1]);
          inspected.add(`${nx},${ny + 1}`);
        }
        if (char === "]" && !inspected.has(`${nx},${ny - 1}`)) {
          toMove.push([nx, ny - 1]);
          inspected.add(`${nx},${ny - 1}`);
        }
      }
    }
    if (isImpossible) continue;
    const newLayout = structuredClone(layout);
    for (const [x, y] of toMove) newLayout[x][y] = ".";
    for (const [x, y] of toMove) newLayout[x + dx][y + dy] = layout[x][y];
    layout = newLayout;
    [rx, ry] = [rx + dx, ry + dy];
  }

  // Calculate the sum of GPS coordinates
  let gps = 0;
  for (let x = 0; x < height; x++) {
    for (let y = 0; y < width; y++) {
      if (["[", "O"].includes(layout[x][y])) gps += 100 * x + y;
    }
  }
  return gps;
};

// Results
console.log(`Part 1: ${solve(layout, instructions)}`);
console.log(`Part 2: ${solve(doubleWidth(layout), instructions)}`);
