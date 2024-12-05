import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { intersection } from "@jakub-l/aoc-lib/collections";
import { sum } from "@jakub-l/aoc-lib/math";

type PageLookup = Record<number, Set<number>>;

// Inputs
const [rawRules, rawUpdates]: [string, string] = readFile(__dirname + "/input.txt", ["\n\n"]);
const rules: PageLookup = parseRules(rawRules);
const updates: number[][] = rawUpdates.split("\n").map(update => update.split(",").map(Number));

/**
 * Parse the rules into a lookup table. The rules are keyed by a page and its
 * value is a set of pages that must be after the key page.
 *
 * @param {string} rawRules - Raw rules
 * @returns {PageLookup} Parsed rules
 */
function parseRules(rawRules: string): PageLookup {
  const rules: PageLookup = {};
  for (const rule of rawRules.split("\n")) {
    const [firstPage, secondPage] = rule.split("|").map(Number);
    if (!rules[firstPage]) rules[firstPage] = new Set();
    rules[firstPage].add(secondPage);
  }
  return rules;
}

// Part 1
/**
 * Check if an update is valid.
 *
 * @param {number[]} update - Updated page numbers
 * @param {PageLookup} rules - Ordering rules that must be followed
 * @returns {boolean} True if the update is valid
 */
function isUpdateValid(update: number[], rules: PageLookup): boolean {
  const seen: Set<number> = new Set();
  for (const page of update) {
    const pageRules = rules[page] ?? new Set();
    if (intersection(seen, pageRules).size > 0) return false;
    seen.add(page);
  }
  return true;
}

/**
 * Get the middle number of an array.
 *
 * @param {number[]} arr - Array of numbers
 * @returns {number} Middle number
 */
function getMiddleNumber(arr: number[]): number {
  return arr[Math.floor(arr.length / 2)];
}

// Part 2
/**
 * Sorts an update such that it follows the page ordering rules.
 *
 * @param {number[]} update - Updated page numbers
 * @param {PageLookup} rules - Ordering rules that must be followed
 * @returns {number[]} Copy of the update array sorted according to the rules
 */
function sortUpdate(update: number[], rules: PageLookup): number[] {
  const updateSet = new Set(update);
  const pagesAfter: PageLookup = {};
  for (const page of update) {
    pagesAfter[page] = intersection(rules[page] ?? new Set(), updateSet);
  }
  return update.toSorted((a, b) => pagesAfter[b].size - pagesAfter[a].size);
}

// Results
const validUpdates = updates.filter(update => isUpdateValid(update, rules));
const fixedInvalidUpdates = updates
  .filter(update => !isUpdateValid(update, rules))
  .map(update => sortUpdate(update, rules));

console.log(`Part 1: ${sum(validUpdates.map(getMiddleNumber))}`);
console.log(`Part 2: ${sum(fixedInvalidUpdates.map(getMiddleNumber))}`);
