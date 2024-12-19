import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

// Inputs
const [rawTowels, rawDesigns] = readFile(`${__dirname}/input.txt`, ["\n\n"]) as string[];
const towels: Set<string> = new Set(rawTowels.split(", "));
const designs: string[] = rawDesigns.split("\n");

// Part 1 & 2
/**
 * Finds the number of arrangements of towels that can be used to form the given design. 
 * @param {string} design - The towel design to make
 * @param {Set<string>} towels - A set of available towels
 * @param {Map<string, number>} memo - A memoized cache of the number of arrangements for each design
 * @returns {number} The number of arrangements of towels that can be used to form the given design
 */
const getArrangements = (
  design: string,
  towels: Set<string>,
  memo: Map<string, number> = new Map()
): number => {
  if (memo.has(design)) return memo.get(design)!;
  if (design.length === 0) return 1;

  let count = 0;
  for (let i = 1; i <= design.length; i++) {
    const [prefix, suffix] = [design.slice(0, i), design.slice(i)];
    if (towels.has(prefix)) count += getArrangements(suffix, towels, memo);
  }
  memo.set(design, count);
  return count;
};

// Results
const arrangementCounts = designs.map(design => getArrangements(design, towels));
console.log(`Part 1: ${arrangementCounts.filter(count => count > 0).length}`);
console.log(`Part 2: ${sum(arrangementCounts)}`);