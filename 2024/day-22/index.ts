// Types

import { Counter } from "@jakub-l/aoc-lib/collections";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

// Constants

// Input
const input: bigint[] = readFile(`${__dirname}/input.txt`, ["\n"], BigInt) as bigint[];
const sample: bigint[] = [1, 10, 100, 2024].map(BigInt);

// Part 1
const mix = (secret: bigint, n: bigint): bigint => n ^ secret;
const prune = (secret: bigint): bigint => secret % 16777216n;

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

const rotateSecret = (start: bigint, count: number): number => {
  let secret = start;
  for (let i = 0; i < count; i++) {
    secret = nextSecret(secret);
  }
  return Number(secret);
};

// Part 2
const getPrices = (start: bigint, count: number): { prices: number[]; diffs: number[] } => {
  let secret = start;
  const prices = [Number(start) % 10];
  const diffs = [];
  for (let i = 1; i < count; i++) {
    secret = nextSecret(secret);
    prices.push(Number(secret) % 10);
    diffs.push(prices[i] - prices[i - 1]);
  }
  return { prices, diffs };
};

const getBestSale = (startSecrets: bigint[], count: number): number => {
  const total = new Counter();
  for (const start of startSecrets) {
    const instructionCounter = new Counter();
    const { prices, diffs } = getPrices(start, count);
    for (let i = 0; i < diffs.length - 3; i++) {
      const instr = diffs.slice(i, i + 4).join(",");
      if (instructionCounter.get(instr) === 0) {
        instructionCounter.set(instr, prices[i + 4]);
      }
    }
    total.combine(instructionCounter);
  }
  console.log(total.mostCommon(1));

  return 0;
};
// Results
// console.log(sum(input.map(n => rotateSecret(n, 2000))));
console.log(getBestSale(input, 2000));
