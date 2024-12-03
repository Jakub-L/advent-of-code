import { readFile } from "@jakub-l/aoc-lib/input-parsing";

const input = readFile(__dirname + "/input.txt", []) as string;

/**
 * Extracts instructions from the input string based on the provided array of instructions.
 *
 * @param {string} input - The input string to search for instructions.
 * @param {Array<string>} instructions - An array of instruction regex strings to match against the input.
 * @returns {Array<string>} An array of matched instruction strings.
 */
const getInstructions = (input: string, instructions: Array<string>): Array<string> => {
  return input.match(new RegExp(instructions.join("|"), "g")) as Array<string>;
};

/**
 * Processes a list of instructions and calculates a sum based on specific rules.
 *
 * The function iterates over an array of instruction strings and performs the following:
 * - If the instruction is "do()", it sets a flag to enable multiplication.
 * - If the instruction is "don't()", it sets a flag to disable multiplication.
 * - If the instruction starts with "mul" and multiplication is enabled, it extracts two numbers from the instruction,
 *   multiplies them, and adds the result to the sum.
 *
 * @param {Array<string>} instructions - An array of instruction strings to be processed.
 * @returns {number} The calculated sum based on the processed instructions.
 */
const processInstructions = (instructions: Array<string>): number => {
  let activeMul = true;
  let sum = 0;
  for (const instruction of instructions) {
    if (instruction === "do()") activeMul = true;
    else if (instruction === "don't()") activeMul = false;
    else if (instruction.startsWith("mul") && activeMul) {
      console.log(instruction);
      const [_, a, b] = instruction.match(/(\d+),(\d+)/) as Array<string>;
      console.log(a, b);
      sum += Number(a) * Number(b);
    }
  }
  return sum;
};

// Part 1
const multiplications = getInstructions(input, ["mul\\(\\d+,\\d+\\)"]);

// Part 2
const instructions = getInstructions(input, ["mul\\(\\d+,\\d+\\)", "do\\(\\)", "don't\\(\\)"]);

// Results
console.log(`Part 1: ${processInstructions(multiplications)}`);
console.log(`Part 2: ${processInstructions(instructions)}`);
