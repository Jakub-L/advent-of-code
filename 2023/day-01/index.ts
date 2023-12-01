import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

const input: string[] = readFile(__dirname + "/input.txt") as string[];


/**
 * Calculates the calibration value based on the given string.
 * The calibration value is calculated by taking the first and last digit from the string and multiplying the first digit by 10, then adding the last digit.
 * If the string contains only one digit, the calibration value is calculated by multiplying the digit by 10 and adding the digit again.
 * @param str - The string from which to calculate the calibration value.
 * @returns The calibration value.
 */
const calibrationValue = (str: string) => {
  const numbers = str.match(/\d/g)?.map(Number) ?? [];
  if (numbers.length === 1) return 10 * numbers[0] + numbers[0];
  return 10 * numbers[0] + numbers[numbers.length - 1];
};

// Part 1
console.log(`Part 1: ${sum(input.map(calibrationValue))}`);
