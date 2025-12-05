import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

// Enums
enum Range {
  Open = 1,
  Close = -1
}

// Input
const [rawRanges, rawIngredients] = readFile(__dirname + "/input.txt", ["\n\n"]);
const ranges: number[][] = parseRanges(rawRanges);
const ingredients: number[] = parseIngredients(rawIngredients);

function parseRanges(rawRanges: string): number[][] {
  return rawRanges
    .split("\n")
    .map(line => line.split("-").map(Number))
    .sort((a, b) => a[0] - b[0]);
}

function parseIngredients(rawIngredients: string): number[] {
  return rawIngredients.split("\n").map(Number);
}

// Part 1
/**
 * Checks if an ingredient is fresh.
 *
 * An ingredient counts as fresh if its value falls within any fresh ingredient
 * range. The ranges are inclusive, i.e. ingredient 5 is fresh for a range 3-5.
 * Assumes the ranges are sorted by minimum value
 *
 *
 * @param ingredient - Value of the ingredient to check
 * @param ranges - List of fresh ingredient ranges
 * @returns True if the ingredient is fresh, false otherwise
 */
const isFresh = (ingredient: number, ranges: number[][]): boolean => {
  for (const [min, max] of ranges) {
    if (ingredient < min) return false;
    if (ingredient <= max) return true;
  }
  return false;
};

// Part 2
/**
 * Finds the minimum ranges that cover the same numbers as the existing ranges.
 * Takes any number of ranges and reduces any overlapping or touching ranges 
 * into a single range. For example, [1, 4] and [4, 6] would be reduced to [1, 6]. 
 * 
 * Firstly, it sorts all range limits (minima and maxima) by value and type (opening
 * before closing, if both have the same value). Then, it iterates through the
 * sorted limits and keeps track of how many openings (+1) and closings (-1) it
 * has seen. If it encounters a new opening, then it begins tracking a new range.
 * When it encounters a closing that brings the count to zero (i.e. no more open
 * ranges), it closes the current range and adds it to the result.
 * 
 * @param ranges - The existing ranges
 * @returns Minimum ranges to cover the same numbers
 */
const reduceRanges = (ranges: number[][]): number[][] => {
  const rangeLimits = ranges
    .flatMap(([min, max]) => [
      { val: min, type: Range.Open },
      { val: max, type: Range.Close }
    ])
    .sort((a, b) => b.type - a.type)
    .sort((a, b) => a.val - b.val);

  const reducedRanges = [];
  let rangeStart = -1;
  let openedRanges = 0;

  for (const { val, type } of rangeLimits) {
    if (openedRanges === 0 && type === Range.Open) rangeStart = val;
    openedRanges += type;
    if (openedRanges === 0 && type === Range.Close) reducedRanges.push([rangeStart, val]);
  }

  return reducedRanges;
};

// Results
console.log(`Part 1: ${ingredients.filter(i => isFresh(i, ranges)).length}`);
console.log(`Part 2: ${sum(reduceRanges(ranges).map(([min, max]) => max - min + 1))}`);
