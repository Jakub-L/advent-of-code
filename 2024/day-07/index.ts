import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

type Equation = {
  target: number;
  elements: number[];
};

// Input parsing
/**
 * Parses a line of the input file into an Equation object
 * @param {string} line - A row from the input file
 * @returns {Equation} The parsed equation
 */
const parseLine = (line: string): Equation => {
  const [rawTarget, rawElements] = line.split(": ");
  return {
    target: Number(rawTarget),
    elements: rawElements.split(" ").map(e => parseInt(e))
  };
};

const input: Equation[] = readFile(__dirname + "/input.txt", ["\n"], parseLine) as Equation[];

// Parts 1 & 2
/** Adds two numbers */
const add = (a: number, b: number): number => a + b;
/** Multiplies two numbers */
const mul = (a: number, b: number): number => a * b;
/** Concatenates two numbers */
const con = (a: number, b: number): number => Number(`${a}${b}`);

/**
 * Checks if the elements can make the target number.
 *
 * The operations ignore the normal order of operations and instead go from left to right.
 *
 * @param {Equation} equation - The equation to check
 * @param {(function(number, number):number)[]} [operations=[add, mul]] - The operations that can
 *      be used to combine the elements
 * @returns {boolean} Whether the elements can make the target number
 */
const isValid = (equation: Equation, operations = [add, mul]): boolean => {
  const { target, elements } = equation;
  let current = [elements[0]];
  for (let i = 1; i < elements.length; i++) {
    const n = elements[i];
    current = current.flatMap(c => operations.map(op => op(c, n)));
  }
  return current.includes(target);
};

/**
 * Returns the target numbers of equations that are valid.
 * @param {Equation[]} equations - The equations to check
 * @param {(function(number, number):number)[]} [operations=[add, mul]] - The operations that can
 *      be used to combine the elements
 * @returns {number[]} The target numbers of the valid equations
 */
const getValidTargets = (equations: Equation[], operations = [add, mul]): number[] => {
  return equations.filter(eq => isValid(eq, operations)).map(e => e.target);
};

// Results
console.log(`Part 1: ${sum(getValidTargets(input))}`);
console.log(`Part 2: ${sum(getValidTargets(input, [add, mul, con]))}`);
