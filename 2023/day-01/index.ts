import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

const input: string[] = readFile(__dirname + "/input.txt") as string[];

/**
 * Calculates the calibration value based on the given string.
 * @param {string} str - The string from which to calculate the calibration value.
 * @returns {number} The calibration value.
 */
const calibrationValue = (str: string) => {
  const numbers = str.match(/\d/g)?.map(Number) ?? [];
  if (numbers.length === 1) return 10 * numbers[0] + numbers[0];
  return 10 * numbers[0] + numbers[numbers.length - 1];
};

// Part 1
console.log(`Part 1: ${sum(input.map(calibrationValue))}`);

// Part 2
const replacementDict = {
  one: "one1one",
  two: "two2two",
  three: "three3three",
  four: "four4four",
  five: "five5five",
  six: "six6six",
  seven: "seven7seven",
  eight: "eight8eight",
  nine: "nine9nine"
};
const preprocessedInput = input.map(line => {
  for (const [original, replacement] of Object.entries(replacementDict)) {
    line = line.replaceAll(original, replacement);
  }
  return line;
});
console.log(`Part 2: ${sum(preprocessedInput.map(calibrationValue))}`);
