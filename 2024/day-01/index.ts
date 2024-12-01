import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";
import { Counter } from "@jakub-l/aoc-lib/collections";

const input: string[][] = readFile(__dirname + "/input.txt", ["\n", "  "]) as string[][];
const listA: number[] = input.map(e => Number(e[0]));
const listB: number[] = input.map(e => Number(e[1]));

/**
 * Calculates the distances between elements of two lists.
 *
 * A distance is defined as the difference between the n-th smallest numbers in
 * the two lists. For example, the distance between [1, 2] and [3, 3] is [2, 1].
 *
 * @param {number[]} listA - First list to compare
 * @param {number[]} listB - Second list to compare
 * @returns {number[]} - List of distances between elements of listA and listB
 */
const distances = (listA: number[], listB: number[]): number[] => {
  const sortedListA = listA.sort((a, b) => a - b);
  const sortedListB = listB.sort((a, b) => a - b);
  return sortedListA.map((n, i) => Math.abs(n - sortedListB[i]));
};

/**
 * Calculates the similarity between two lists.
 *
 * The similarity between two lists is defined as the product of the value of an
 * element in the first list and the number of times it appears in the second list.
 *
 * @param {number[]} values - List of values of interest
 * @param {number[]} appearances - List of appearances
 * @returns {number[]} - List of distances between elements of values and appearances
 */
const similarity = (values: number[], appearances: number[]): number[] => {
  const counts = new Counter(appearances);
  return values.map(e => e * counts.get(e));
};

// Part 1
console.log(`Part 1: ${sum(distances(listA, listB))}`);

// Part 2
console.log(`Part 2: ${sum(similarity(listA, listB))}`);
