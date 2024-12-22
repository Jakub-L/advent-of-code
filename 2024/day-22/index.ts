// Types

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
// Results
// console.log(sum(sample.map(n => rotateSecret(n, 2000))));
console.log(sum(input.map(n => rotateSecret(n, 2000))));
