/**
 * Solution to Day 4 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/4
 */
import { readInput } from '../utils';

// TYPES & CLASSES
/** An interval */
class Interval {
  start: number;
  end: number;

  /**
   * Creates a new interval
   * @param {number} start - Start of the interval, inclusive
   * @param {number} end - End of the interval, inclusive
   */
  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
  }

  /**
   * Finds this interval's and target interval's overlap
   * @param {Interval} target - Interval to compare
   * @returns {Interval} The shared interval
   */
  findOverlap(target: Interval): Interval {
    if (target.start > this.end || this.start > target.end) {
      return new Interval(NaN, NaN);
    }
    return new Interval(Math.max(this.start, target.start), Math.min(this.end, target.end));
  }

  /** The length of the interval, inclusive of start and end */
  get length(): number {
    if (isNaN(this.start) || isNaN(this.end)) return 0;
    return this.end - this.start + 1;
  }
}

/** A pair of intervals */
type Pair = [Interval, Interval];

// INPUTS
/**
 * Parses a pair string to a pair of interval classes
 * @param {string} raw
 * @returns {Pair} A pair of intervals defined by the strings
 */
const parsePair = (raw: string): Pair =>
  raw
    .split(',')
    .map(pair => pair.split('-').map(Number))
    .map(([start, end]) => new Interval(start, end)) as Pair;

const pairs: Pair[] = readInput('./day-04/input.txt', '\n').map(parsePair);

// PART 1
/**
 * Checks if either of a pair of intervals fully contains another interval
 * @param {Pair} param0 - Pair of intervals to compare
 * @returns {boolean} True if one interval is fully contained within the other, else False
 */
const isFullyContained = ([a, b]: Pair): boolean => {
  const overlap = a.findOverlap(b);
  return overlap.length === a.length || overlap.length === b.length;
};

// PART 2
/**
 * Checks if there is any overlap between two intervals
 * @param {Pair} param0 - Pair of intervals to compare
 * @returns {boolean} True if the intervals overlap at all, else False
 */
const hasAnyOverlap = ([a, b]: Pair): boolean => a.findOverlap(b).length > 0;

// RESULTS
console.log(`Part 1 solution: ${pairs.filter(isFullyContained).length}`);
console.log(`Part 2 solution: ${pairs.filter(hasAnyOverlap).length}`);
