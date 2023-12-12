import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

type Record = { pattern: string; counts: number[] };
const parseLine = ([pattern, counts]: string[]): Record => ({ pattern, counts: counts.split(",").map(Number) });

// UTILS
/**
 * Memoizes a function.
 * @template A - Arguments
 * @template R - Result
 * @param {(A) => R} func - Function to memoize. Must take serializable arguments.
 * @returns {(A) => R} Memoized function
 */
const memoize = <A extends unknown[], R>(func: (...args: A) => R): ((...args: A) => R) => {
  const store = new Map<string, R>();

  return (...args: A): R => {
    const lookup = JSON.stringify(args);
    if (store.has(lookup)) return store.get(lookup)!;
    const result = func(...args);
    store.set(lookup, result);
    return result;
  };
};

/**
 * Counts the number of possible matches for a given pattern and counts.
 * @param {string} pattern - The pattern to match
 * @param {number[]} counts - The counts to match
 * @returns {number} The number of possible matches
 */
const countPossibilites = memoize((pattern: string, counts: number[]): number => {
  // No pattern left requires no counts for a match
  if (pattern.length === 0) {
    if (counts.length === 0) return 1;
    return 0;
  }

  // Check 2: No counts left, but the pattern has to have no hashes for a match
  if (counts.length === 0) return /^[^#]+$/.test(pattern) ? 1 : 0;

  // We have to have enough pattern for the sum of all counts + one
  // dot per gap between counts
  if (pattern.length < sum(counts) + (counts.length - 1)) return 0;

  // A dot has no impact
  if (pattern[0] === ".") return countPossibilites(pattern.slice(1), counts);

  // A hash has to match with the first count
  if (pattern[0] === "#") {
    const [firstCount, ...restCounts] = counts;

    // If we hit a dot, before the end of the count, we can't build the #-run
    for (let i = 0; i < firstCount; i++) {
      if (pattern[i] === ".") return 0;
    }

    // If there's a hash at the end of the run, that means the actual run is
    // too long and there's no match.
    if (pattern[firstCount] === "#") return 0;

    // Otherwise we lop off the first count from the pattern and the counts
    // and continue the calculation we add a 1 to the slice to account for
    // the necessary gap
    return countPossibilites(pattern.slice(firstCount + 1), restCounts);
  }

  // A question mark is a wildcard, so we have to check both possibilities
  return countPossibilites(`#${pattern.slice(1)}`, counts) + countPossibilites(`.${pattern.slice(1)}`, counts);
});

/**
 * Unfolds a record by multiplying the pattern and counts by a given factor. The pattern
 * gets repeated N-fold and joined by question marks.
 * @param {Record} record - The record to unfold
 * @param {number} [multiple=5] - The factor to multiply the pattern and counts by
 * @returns {Record} The unfolded record
 */
const unfold = (record: Record, multiple: number = 5): Record => ({
  pattern: Array(multiple).fill(record.pattern).join("?"),
  counts: Array(multiple).fill(record.counts).flat()
});

// INPUT PARSING
const input = (readFile(`${__dirname}/input.txt`, ["\n", " "]) as string[][]).map(parseLine);
const unfoldedInput = input.map(record => unfold(record));

// RESULTS
console.log(`Part 1: ${sum(input.map(({ pattern, counts }) => countPossibilites(pattern, counts)))}`);
console.log(`Part 2: ${sum(unfoldedInput.map(({ pattern, counts }) => countPossibilites(pattern, counts)))}`);
