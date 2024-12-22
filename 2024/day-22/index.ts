import { Counter } from "@jakub-l/aoc-lib/collections";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

// Types
type Pricing = { prices: number[]; diffs: number[] };

// Constants
/** Number of times the monkeys cycle their secret numbers */
const SECRET_ROTATION_COUNT = 2000;

// Input
const input: bigint[] = readFile(`${__dirname}/input.txt`, ["\n"], BigInt) as bigint[];

// Part 1
const mix = (secret: bigint, n: bigint): bigint => n ^ secret;
const prune = (secret: bigint): bigint => secret % 16777216n;

/**
 * Generates the next secret number in the sequence. Uses BigInt to avoid
 * issues with JavaScript's 32-bit XOR limit.
 *
 * @param {bigint} initial - The initial secret number
 * @returns {bigint} The next secret number
 */
const nextSecret = (initial: bigint): bigint => {
  let result = initial;
  const a = result * 64n;
  result = prune(mix(a, result));
  const b = result / 32n;
  result = prune(mix(b, result));
  const c = result * 2048n;
  result = prune(mix(c, result));
  return result;
};

/**
 * Rotates the secret number a fixed number of times and returns the final
 * secret number.
 *
 * @param {bigint} start - The initial secret number
 * @returns {number} The final secret number
 */
const rotateSecret = (start: bigint): number => {
  let secret = start;
  for (let i = 0; i < SECRET_ROTATION_COUNT; i++) secret = nextSecret(secret);
  return Number(secret);
};

// Part 2
/**
 * Generates the prices and price differences for a given secret number.
 * The prices are the final digit of each secret number.
 *
 * @param {bigint} start - The initial secret number
 * @returns {Pricing} The prices and price differences
 */
const getPrices = (start: bigint): Pricing => {
  let secret = start;
  const prices = [Number(start) % 10];
  const diffs = [];
  for (let i = 1; i < SECRET_ROTATION_COUNT; i++) {
    secret = nextSecret(secret);
    prices.push(Number(secret) % 10);
    diffs.push(prices[i] - prices[i - 1]);
  }
  return { prices, diffs };
};

/**
 * Finds the maximum number of bananas that can be received for sales of
 * hiding places, assuming that a single 4-difference instruction has to
 * be used for selling to all buyers.
 *
 * @param {bigint} startSecrets - The initial secret numbers
 * @returns {number} The maximum number of bananas
 */
const getBestSale = (startSecrets: bigint[]): number => {
  const total = new Counter();
  for (const start of startSecrets) {
    const instructionCounter = new Counter();
    const { prices, diffs } = getPrices(start);
    for (let i = 0; i < diffs.length - 3; i++) {
      const instr = diffs.slice(i, i + 4).join(",");
      // The seller will sell as soon as the instructions are
      // encountered, so if we find a better price later, we
      // should ignore it.
      //
      // This is also why we have a separate counter for each
      // secret number. We want to track the first occurence per
      // secret number, rather than globally.
      if (instructionCounter.get(instr) === 0) {
        instructionCounter.set(instr, prices[i + 4]);
      }
    }
    total.combine(instructionCounter);
  }
  return total.mostCommon(1)[0][1];
};

// Results
const finalSecrets = input.map(n => rotateSecret(n));

console.log(`Part 1: ${sum(finalSecrets)}`);
console.log(`Part 2: ${getBestSale(input)}`);
