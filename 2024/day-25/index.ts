import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// Types
/** A key or lock schematic */
type Schematic = {
  /** The heights of the pins/tumblers */
  heights: number[];
  /** Whether the schematic is a lock */
  isLock: boolean;
};

// Inputs
/** Parses a string into a schematic object */
const parseSchematic = (rawSchematic: string[]): Schematic => {
  const heights = Array(rawSchematic[0].length).fill(-1);
  for (let row of rawSchematic) {
    for (let i = 0; i < row.length; i++) {
      if (row[i] === "#") heights[i]++;
    }
  }
  return { heights, isLock: rawSchematic[0][0] === "#" };
};

const input: string[][] = readFile(`${__dirname}/input.txt`, ["\n\n", "\n"]) as string[][];
const schematics = input.map(parseSchematic);

// Part 1
/**
 * Counts how many key-lock pairs fit together. A fit is defined as
 * none of the combined heights of the pins/tumblers exceeding 5.
 * @param {Schematic[]} schematics - An array of locks and keys
 * @returns {number} - The number of fitting pairs
 */
const countFittingPairs = (schematics: Schematic[]): number => {
  const locks = schematics.filter(s => s.isLock);
  const keys = schematics.filter(s => !s.isLock);
  let fits = 0;

  for (let { heights: lH } of locks) {
    for (let { heights: kH } of keys) {
      if (lH.every((h, i) => h + kH[i] <= 5)) fits++;
    }
  }
  return fits;
};

// Results
console.log(`Part 1: ${countFittingPairs(schematics)}`);
