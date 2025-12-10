import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

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

// console.log(findMinimumPresses(testInput[0]));
// console.log(findMinimumPresses(testInput[1]));
// console.log(findMinimumPresses(testInput[2]));
console.log(sum(input.map(findMinimumPresses)));
