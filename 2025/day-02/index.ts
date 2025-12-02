import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// Input
const input: number[][] = readFile(__dirname + "/input.txt", [",", "-"], Number) as number[][];
const testInput: number[][] =
  `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`
    .split(",")
    .map(r => r.split("-").map(Number));

// Part 1
const findInvalidIds = (input: number[][]): number[] => {
  const invalidIds: number[] = [];
  const sortedInput = input.sort((a, b) => b[0] - a[0]);
  const maxNumber = Math.max(...input.flat());
  const maxDigits = maxNumber.toString().length;

  for (let i = 0; i < 10 ** Math.ceil(maxDigits / 2); i++) {
    const invalidId = Number(`${i}${i}`);
    for (const [start, end] of sortedInput) {
      if (invalidId > end) break;
      if (invalidId >= start && invalidId <= end) {
        invalidIds.push(invalidId);
      }
    }
  }

  return invalidIds;
};

console.log(`Part 1: ${findInvalidIds(input).reduce((a, b) => a + b, 0)}`);
