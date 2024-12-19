import { readFile } from "@jakub-l/aoc-lib/input-parsing";


// Inputs
// const [rawTowels, rawDesigns] = `r, wr, b, g, bwu, rb, gb, br
//
// brwrr
// bggr
// gbbr
// rrbgbr
// ubwu
// bwurrg
// brgr
// bbrgwb`.split("\n\n");

const [rawTowels, rawDesigns] = readFile(`${__dirname}/input.txt`, ["\n\n"]) as string[]
const towels: Set<string> = new Set(rawTowels.split(", "));
const designs: string[] = rawDesigns.split("\n");

// Part 1
const isPossible = (design: string, towels: Set<string>) => {
  if (towels.has(design) || design.length === 0) return true;
  for (let i = 1; i < design.length; i++) {
    const [prefix, suffix] = [design.slice(0, i), design.slice(i)];
    if (towels.has(prefix) && isPossible(suffix, towels)) return true
  }
  return false;
};

// console.log(towels, designs)
console.log(designs.filter(design => isPossible(design, towels)).length);
