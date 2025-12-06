import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

// Types
type Operation = (a: number, b: number) => number;

// Constants
const OPERATIONS: Record<string, Operation> = {
  "+": (a: number, b: number) => a + b,
  "*": (a: number, b: number) => a * b
};
const STARTING_VALUES: Record<string, number> = { "+": 0, "*": 1 };

// Input
const rawInput: string[] = readFile(__dirname + "/input.txt");
const { ops, starts, nums, colwiseNums } = parseInput(rawInput);

/**
 * Parses the raw input string (split by rows) to useful data for AoC
 * @param rawInput - Raw input split by newline
 * @returns An object containing:
 *          - The operation functions to perform on each column
 *          - The starting values of accumulators for those columns
 *          - The numbers in the grid
 *          - The colwise numbers in the grid
 */
function parseInput(rawInput: string[]) {
  const splitInput = rawInput.map(line => line.trim().split(/\s+/));
  const starts = splitInput.at(-1)!.map(op => STARTING_VALUES[op]);
  const ops = splitInput.at(-1)!.map(op => OPERATIONS[op]);
  const nums = splitInput.slice(0, -1).map(line => line.map(Number));
  const colwiseNums = toColwise(rawInput);
  return { ops, starts, nums, colwiseNums };
}

// Part 1
/**
 * Performs an operation on each column, and returns the sum of the results.
 *
 * Each number is treated as a number and its position does not affect its value.
 * For example " 55" and "55 " are the same number.
 *
 * @param ops - Operations to perform on each column, indexed by column
 * @param starts - The starting values of each column's accumulator
 * @param nums - The number grid
 * @returns The sum of all columns' operations
 */
const solveProblems = (ops: Operation[], starts: number[], nums: number[][]): number => {
  const solutions: number[] = [...starts];
  for (let row = 0; row < nums.length; row++) {
    for (let col = 0; col < nums[row].length; col++) {
      solutions[col] = ops[col](solutions[col], nums[row][col]);
    }
  }
  return sum(solutions);
};

// Part 2
/**
 * Converts the input into a colwise representation.
 *
 * First, converts each column into a string, taking into account positional
 * values. For example:
 * 1234 123
 *   44  45
 *   2
 * Becomes [ "1  ", "2  ", "342", "44 ", "   ", "1  ", "24 ", "35 " ]
 *
 * Then, converts these strings into numbers (trimming whitespace) and splits
 * into calculation columns by blank entries. For example, the above
 * becomes [ [1, 2, 342, 44], [1, 24, 35] ]
 *
 * @param rawInput - Raw input split by newline
 * @returns An array of colwise numbers, with each sub-array representing a
 *          calculation column.
 */
function toColwise(rawInput: string[]): number[][] {
  const colwiseStrings: string[] = [];
  for (let row = 0; row < rawInput.length - 1; row++) {
    for (let col = 0; col < rawInput[row].length; col++) {
      colwiseStrings[col] = `${colwiseStrings[col] ?? ""}${rawInput[row][col]}`;
    }
  }

  const colwiseNums: number[][] = [];
  let col: number[] = [];
  for (const str of colwiseStrings.map(s => s.trim())) {
    if (str === "") {
      colwiseNums.push(col);
      col = [];
    } else {
      col.push(Number(str));
    }
  }
  colwiseNums.push(col);
  return colwiseNums;
}

/**
 * Performs an operation on each column (colwise), and returns the sum of the results.
 *
 * @param ops - Operations to perform on each column, indexed by column
 * @param starts - The starting values of each column's accumulator
 * @param nums - The colwise number grid
 * @returns
 */
const solveColwiseProblems = (
  ops: Operation[],
  starts: number[],
  nums: number[][]
): number => {
  return sum(nums.map((row, i) => row.reduce((result, n) => ops[i](result, n), starts[i])));
};

// Results
console.log(`Part 1: ${solveProblems(ops, starts, nums)}`);
console.log(`Part 2: ${solveColwiseProblems(ops, starts, colwiseNums)}`);
