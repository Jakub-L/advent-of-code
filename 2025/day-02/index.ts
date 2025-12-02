import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// Input
const input: number[][] = readFile(__dirname + "/input.txt", [",", "-"], Number) as number[][];

// Part 1
/**
 * Finds the invalid IDs in the input array of product IDs.
 *
 * Does not differentiate between IDs that are the same number but generated different ways
 * - e.g. 222222 is the same whether it is 22-22-22 or 222-222.
 *
 * @param productIds - The input array of produdct IDs, in the format of [start, end]
 * @param onlyDoubles - Whether to only look for double IDs, e.g. 11, 123123, but not 123123123, etc.
 * @returns An array of unique invalid IDs
 */
const findInvalidIds = (productIds: number[][], onlyDoubles: boolean = true): number[] => {
  const invalidIds: number[] = [];
  const sortedInput = productIds.sort((a, b) => b[0] - a[0]);
  const maxNumber = Math.max(...productIds.flat());
  const maxDigits = maxNumber.toString().length;

  for (let i = 1; i < 10 ** Math.ceil(maxDigits / 2); i++) {
    let invalidId = Number(`${i}${i}`);
    while (invalidId <= maxNumber) {
      for (const [start, end] of sortedInput) {
        if (invalidId > end) break;
        if (invalidId >= start && invalidId <= end) {
          invalidIds.push(invalidId);
        }
      }
      if (onlyDoubles) break;
      invalidId = Number(`${invalidId}${i}`);
    }
  }

  return Array.from(new Set(invalidIds));
};

// Results
console.log(`Part 1: ${findInvalidIds(input).reduce((a, b) => a + b, 0)}`);
console.log(`Part 2: ${findInvalidIds(input, false).reduce((a, b) => a + b, 0)}`);
