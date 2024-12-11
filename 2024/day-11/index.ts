import { readFile } from "@jakub-l/aoc-lib/input-parsing";

const input: number[] = readFile(`${__dirname}/input.txt`, [" "], Number) as number[];

// Part 1
const blink = (input: number[], times: number = 1): number[] => {
  let result = input;
  for (let i = 0; i < times; i++) {
    result = result.flatMap(n => {
      if (n === 0) return 1;
      const s = n.toString();
      if (s.length % 2 === 0) return [Number(s.slice(0, s.length / 2)), Number(s.slice(s.length / 2))];
      return n * 2024;
    });
  }
  return result;
};

// console.log(input);
console.log(blink(input, 25).length);
