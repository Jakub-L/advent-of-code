import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

type Element = { number: number; isPart: boolean };

const input: string[][] = readFile(__dirname + "/input.txt", ["\n", ""]) as string[][];

const test = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`
  .split("\n")
  .map(line => line.split(""));

// UTILS
/**
 * Checks whether a number is adjacent (including diagonals) to a symbol.
 * @param {string[][]} schematic - The schematic to check.
 * @param {number} x - The x coordinate of the number.
 * @param {number} y - The y coordinate of the number.
 * @returns {boolean} True if any neighbouring fields are symbols (period excluded)
 */
const checkAdjacency = (schematic: string[][], x: number, y: number): boolean => {
  // prettier-ignore
  const neighbourDeltas = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
  for (const [dx, dy] of neighbourDeltas) {
    const neighbour = schematic[y + dy]?.[x + dx];
    if (neighbour && neighbour !== "." && isNaN(Number(neighbour))) return true;
  }
  return false;
};

/**
 * Parses a schematic and returns an array of parts.
 * @param {string[][]} schematic - The schematic to parse.
 * @returns {Element[]} The parsed parts.
 */
const parseSchematic = (schematic: string[][]): Element[] => {
  const result: Element[] = [];
  let part = { number: 0, isPart: false };
  for (let y = 0; y < schematic.length; y++) {
    for (let x = 0; x < schematic[y].length; x++) {
      const char = schematic[y][x];
      if (!isNaN(Number(char))) {
        part.number = 10 * part.number + Number(char);
        if (!part.isPart) part.isPart = checkAdjacency(schematic, x, y);
      } else if (part.number > 0) {
        result.push(part);
        part = { number: 0, isPart: false };
      }
    }
  }
  return result;
};

// RESULTS
console.log(
  `Part 1: ${sum(
    parseSchematic(test)
      .filter(({ isPart }) => isPart)
      .map(({ number }) => number)
  )}`
);
