import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// Input
const [rawRanges, rawIngredients] = readFile(__dirname + "/input.txt", ["\n\n"]);
// const [rawRanges, rawIngredients] = `3-5
// 10-14
// 16-20
// 12-18

// 1
// 5
// 8
// 11
// 17
// 32`.split("\n\n");

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
const isFresh = (ingredient: number, ranges: number[][]): boolean => {
  for (const [min, max] of ranges) {
    if (ingredient < min) return false;
    if (ingredient <= max) return true;
  } 
  return false;
}


console.log(ingredients.filter(i => isFresh(i, ranges)).length);
