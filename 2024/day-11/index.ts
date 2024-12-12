import { Counter } from "@jakub-l/aoc-lib/collections";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";

const input: number[] = readFile(`${__dirname}/input.txt`, [" "], Number) as number[];

// Part 1
const blink = (input: number[], times: number = 1): Counter => {
  const nextValue = (n: number): number[] => {
    const s = n.toString();
    if (n === 0) return [1];
    if (s.length % 2 === 0) return [Number(s.slice(0, s.length / 2)), Number(s.slice(s.length / 2))];
    return [n * 2024];
  };

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

console.log(blink(input, 75).total);
