import { Counter } from "@jakub-l/aoc-lib/collections";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";

const input: number[] = readFile(`${__dirname}/input.txt`, [" "], Number) as number[];

// Part 1 & 2
/**
 * Halves a number into two equal parts. Leading zeros are not preserved.
 *
 * @example halve(1234) => [12, 34]
 * @example halve(1200) => [12, 0]
 * @example halve(123) => Error: Number must have an even number of digits
 *
 * @param {number} n - The number to halve
 * @returns {number[]} The two halves
 * @throws {Error} If the number has an odd number of digits
 */
const halve = (n: number): number[] => {
  const s = n.toString();
  if (s.length % 2 !== 0) throw new Error("Number must have an even number of digits");
  return [Number(s.slice(0, s.length / 2)), Number(s.slice(s.length / 2))];
};

/**
 * Returns the next value(s) for a given number, following the rules of blinking:
 * - If the number is 0, it becomes 1
 * - If the number has an even number of digits, it is split into two equal parts
 * - Otherwise, the number is multiplied by 2024
 *
 * @param {number} n - The number to process
 * @returns {number[]} The next value(s)
 */
const nextValue = (n: number): number[] => {
  if (n === 0) return [1];
  if (n.toString().length % 2 === 0) return halve(n);
  return [n * 2024];
};

/**
 * Performs a 'blink' a specified number of times.
 *
 * During each blink, all the values in the input array are processed simultanously
 * according to the following steps:
 * - If the value is 0, it becomes 1
 * - If the value has an even number of digits, it is split into two equal parts,
 *   e.g. 1234 -> 12, 34
 * - Otherwise, the value is multiplied by 2024
 *
 * Blinking N times is equivalent to applying the above steps to the output of the
 * previous iteration, i.e. blink([1 2, 3], 3) is equivalent to
 * blink(blink(blink([1 2, 3], 1), 1), 1)
 *
 * @param {number[]} input - The initial values
 * @param {number} times - The number of times to blink
 * @returns {Counter} The final values and how many times they appear
 */
const blink = (input: number[], times: number): Counter => {
  let counter = new Counter(input);
  for (let i = 0; i < times; i++) {
    const nextCounter = new Counter();
    for (const [element, count] of counter.entries()) {
      for (const val of nextValue(element)) {
        nextCounter.set(val, nextCounter.get(val) + count);
      }
    }
    counter = nextCounter;
  }
  return counter;
};

// Results
console.log(`Part 1: ${blink(input, 25).total}`);
console.log(`Part 2: ${blink(input, 75).total}`);
