import { Counter } from "@jakub-l/aoc-lib/collections";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";

type Point = { x: number; y: number };

const input: string[][] = readFile(__dirname + "/input.txt", ["\n", ""]) as string[][];

// Part 1
class Antenna {
  public frequency: string;

  constructor(frequency: string) {
    this.frequency = frequency;
  }
}

const chars = new Counter();
for (const row of input) {
  for (const char of row) {
    if (/^[a-z0-9]+$/i.test(char)) chars.add(char);
  }
}
console.log(chars);
