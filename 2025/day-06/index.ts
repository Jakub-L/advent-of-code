import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

// Types
type Operation = (a: number, b: number) => number;

// Constants
const OP: Record<string, Operation> = {
  "+": (a: number, b: number) => a + b,
  "*": (a: number, b: number) => a * b
};

// Input
const rawInput = readFile(__dirname + "/input.txt");
const testInput = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `.split("\n");
const { ops, nums } = parseInput(rawInput);

function parseInput(rawInput: string[]) {
  const splitInput = rawInput.map(line => line.trim().split(/\s+/));
  const nums = splitInput.slice(0, -1).map(line => line.map(Number));
  return { ops: splitInput[splitInput.length - 1], nums };
}

// Part 1
const solveProblems = (ops: string[], nums: number[][]): number => {
  let solutions: number[] = [];
  for (let row = 0; row < nums.length; row++) {
    for (let col = 0; col < nums[row].length; col++) {
      const operator = ops[col];
      const operation = OP[operator]
      const fallback = operator === "+" ? 0 : 1
      solutions[col] = operation((solutions[col] ?? fallback), nums[row][col])
    }
  }
  return sum(solutions)
}

console.log(solveProblems(ops, nums))