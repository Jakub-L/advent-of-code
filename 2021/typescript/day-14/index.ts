/**
 * Solution to Day 14 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/14
 */
import { readInput } from '../utils';

// INPUTS
const [template, rawInstr] = readInput('./../../inputs/day-14.txt', '\n\n');
const instructions = rawInstr.split('\n');

// UTILS
class Polymer {
  /** Count of each of the polymer's pairs */
  pairs: { [index: string]: number };
  /** Count of individual characters in a polymer */
  chars: { [index: string]: number };
  /**
   * Set of rules indexed by polymer pair, containing the character to be inserted (`insert`)
   * and the two pairs this in turn generates (`targets`)
   */
  rules: { [index: string]: { insert: string; targets: string[] } };

  /**
   * Creates a new polymer
   * @param {string} template - Starting polymer template
   * @param {string[]} rules - List of insertions as strings in the form `PAIR -> INSERT`
   */
  constructor(template: string, rules: string[]) {
    this.pairs = {};
    this.rules = {};
    this.chars = template
      .split('')
      .reduce<{ [index: string]: number }>((acc, c) => {
        acc[c] = acc[c] + 1 || 1;
        return acc;
      }, {});

    for (let i = 0; i < template.length - 1; i++) {
      const pair = template.slice(i, i + 2);
      this.pairs[pair] = this.pairs[pair] + 1 || 1;
    }

    for (let rule of rules) {
      const [pair, insert] = rule.split(' -> ');
      this.rules[pair] = {
        insert,
        targets: [`${pair[0]}${insert}`, `${insert}${pair[1]}`]
      };
    }
  }

  /**
   * Advances the polymerisation by one step, according to the rules
   */
  step() {
    const newPairs: { [index: string]: number } = {};
    for (let [pair, count] of Object.entries(this.pairs)) {
      const { insert, targets } = this.rules[pair];
      for (let target of targets) {
        newPairs[target] = newPairs[target] + count || count;
      }
      this.chars[insert] = this.chars[insert] + count || count;
    }
    this.pairs = newPairs;
  }
}

/**
 * Finds the difference between the counts of the most common and least common polymer character
 * @param {Polymer} polymer - The polymer to inspect
 * @returns {number} Difference between the counts
 */
const countDifference = (polymer: Polymer): number => {
  const sortedCounts = Object.values(polymer.chars).sort((a, b) => a - b);
  return sortedCounts[sortedCounts.length - 1] - sortedCounts[0];
};

// PART 1
const firstPolymer = new Polymer(template, instructions);
for (let i = 0; i < 10; i++) firstPolymer.step();

// PART 2
const secondPolymer = new Polymer(template, instructions);
for (let i = 0; i < 40; i++) secondPolymer.step();

// OUTPUTS
console.log(`Part 1: ${countDifference(firstPolymer)}`);
console.log(`Part 2: ${countDifference(secondPolymer)}`);
