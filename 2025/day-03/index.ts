import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// Input
const input: number[][] = readFile(__dirname + "/input.txt", ["\n", ""], Number) as number[][];
const testInput: number[][] = `987654321111111
811111111111119
234234234234278
818181911112111`
  .split("\n")
  .map(line => line.split("").map(Number));

// Part 1
const findBankJoltage = (bank: number[]): number => {
  let digits = [0, 0];
  for (let i = 0; i < bank.length - 1; i++) {
    if (bank[i] < digits[0]) continue;
    for (let j = i + 1; j < bank.length; j++) {
      const oldNumber = 10 * digits[0] + digits[1];
      const newNumber = 10 * bank[i] + bank[j];
      if (newNumber > oldNumber) digits = [bank[i], bank[j]];
    }
  }
  return digits[0] * 10 + digits[1];
};

console.log(input.map(findBankJoltage).reduce((acc, n) => acc + n, 0));
