import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

// Input
const input: number[][] = readFile(__dirname + "/input.txt", ["\n", ""], Number) as number[][];

// Part 1 & 2
/**
 * Finds the maximum joltage of a bank of batteries.
 * 
 * This is the maximum number that can be formed by concatenating battery charge (numbers in the
 * bank array). The batteries must be used in order they appear.
 * 
 * @param bank - The bank of batteries to find the joltage of
 * @param batteryCount - The number of batteries to use to find the joltage
 * @returns The joltage of the bank of batteries
 */
const findBankJoltage = (bank: number[], batteryCount: number = 2): number => {
  let digits: number[] = [];
  let startIndex = 0;

  for (let n = 1; n <= batteryCount; n++) {
    let currMax = 0;
    let currIndex = 0;
    for (let i = startIndex; i < bank.length - batteryCount + n; i++) {
      if (bank[i] > currMax) {
        currMax = bank[i];
        currIndex = i + 1;
      }
    }
    digits.push(currMax);
    startIndex = currIndex;
  }

  return digits.reduce((acc, d) => acc * 10 + d, 0);
};

// Results
console.log(`Part 1: ${sum(input.map(n => findBankJoltage(n, 2)))}`);
console.log(`Part 2: ${sum(input.map(n => findBankJoltage(n, 12)))}`);
