import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { prod, sum } from "@jakub-l/aoc-lib/math";

type Element = { number: number; isPart: boolean; adjacentGears: Set<string> };

const input: string[][] = readFile(__dirname + "/input.txt", ["\n", ""]) as string[][];

// UTILS
/**
 * Checks whether a set of coordinates is adjacent (including diagonals) to a symbol.
 * @param {string[][]} schematic - The schematic to check.
 * @param {number} x - The x coordinate of the number.
 * @param {number} y - The y coordinate of the number.
 * @returns {boolean} True if any neighbouring fields are symbols (period excluded)
 */
const isNextToSymbol = (schematic: string[][], x: number, y: number): boolean => {
  // prettier-ignore
  const neighbourDeltas = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
  for (const [dx, dy] of neighbourDeltas) {
    const neighbour = schematic[y + dy]?.[x + dx];
    if (neighbour && neighbour !== "." && isNaN(Number(neighbour))) return true;
  }
  return false;
};

/**
 * Returns an array of coordinates of gears neighbouring a set of coordinates.
 * @param {string[][]} schematic - The schematic to check.
 * @param {number} x - The x coordinate of the number.
 * @param {number} y - The y coordinate of the number.
 * @returns {Set<string>} A set of adjacent gear positions in the format of "x,y".
 */
const getNeighbouringGears = (schematic: string[][], x: number, y: number): Set<string> => {
  const result: Set<string> = new Set();
  // prettier-ignore
  const neighbourDeltas = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
  for (const [dx, dy] of neighbourDeltas) {
    const neighbour = schematic[y + dy]?.[x + dx];
    if (neighbour && neighbour === "*") result.add(`${x + dx},${y + dy}`);
  }
  return result;
};

/**
 * Parses a schematic and returns an array of parts.
 * @param {string[][]} schematic - The schematic to parse.
 * @returns {Element[]} The parsed parts.
 */
const parseSchematic = (schematic: string[][]): Element[] => {
  const result: Element[] = [];
  let part = { number: 0, isPart: false, adjacentGears: new Set<string>() };
  for (let y = 0; y < schematic.length; y++) {
    for (let x = 0; x < schematic[y].length; x++) {
      const char = schematic[y][x];
      if (!isNaN(Number(char))) {
        part.number = 10 * part.number + Number(char);
        part.adjacentGears = new Set([...part.adjacentGears, ...getNeighbouringGears(schematic, x, y)]);
        if (!part.isPart) part.isPart = isNextToSymbol(schematic, x, y);
      } else if (part.number > 0) {
        result.push(part);
        part = { number: 0, isPart: false, adjacentGears: new Set<string>() };
      }
    }
  }
  return result;
};

/**
 * Finds all gear ratios in a schematic. A gear ratio is defined as the product of all numbers adjacent
 * to a gear, but only if there is at least two adjacent numbers.
 * @param {Element[]} elements - The elements to check.
 * @returns {number[]} An array of gear ratios.
 */
const getGearRatios = (elements: Element[]): number[] => {
  // First we invert the list of gears adjacent to elements, to find the elements adjacent to each gear
  const partsAdjacentToGears: { [key: string]: number[] } = {};
  for (const element of elements) {
    if (element.adjacentGears.size > 0) {
      for (const gear of element.adjacentGears) {
        partsAdjacentToGears[gear] = [...(partsAdjacentToGears[gear] ?? []), element.number];
      }
    }
  }
  return Object.values(partsAdjacentToGears)
    .filter(gears => gears.length > 1)
    .map(prod);
};

// RESULTS
const schematic = parseSchematic(input);
console.log(`Part 1: ${sum(schematic.filter(element => element.isPart).map(part => part.number))}`);
console.log(`Part 2: ${sum(getGearRatios(schematic))}`);
