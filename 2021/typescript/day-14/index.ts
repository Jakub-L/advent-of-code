/**
 * Solution to Day 14 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/14
 */
import { readInput } from '../utils';

const test = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`
  .split('\n\n')
  .map((e) => e.split('\n'));

// INPUTS
const [template, rawInstr] = readInput('./../../inputs/day-14.txt', '\n\n');
const instructions = rawInstr.split('\n');

// UTILS
class Polymer {
  chain: string;
  rules: { [index: string]: string };

  constructor(template: string, rules: string[]) {
    this.chain = template;
    this.rules = rules.reduce<{ [index: string]: string }>((dict, rule) => {
      const [pattern, insert] = rule.split(' -> ');
      dict[pattern] = `${pattern[0]}${insert}`;
      return dict;
    }, {});
  }

  step() {
    let newChain = '';
    for (let i = 0; i < this.chain.length - 1; i += 1) {
      const pair = this.chain.slice(i, i + 2);
      newChain = `${newChain}${this.rules[pair] || pair}`;
    }
    newChain = `${newChain}${this.chain[this.chain.length - 1]}`;
    this.chain = newChain;
  }

  get characterCounts(): { [index: string]: number } {
    return this.chain
      .split('')
      .reduce<{ [index: string]: number }>((acc, c) => {
        acc[c] = acc[c] ? acc[c] + 1 : 1;
        return acc;
      }, {});
  }
}

// PART 1
const firstPolymer = new Polymer(template, instructions);
for (let i = 0; i < 10; i++) firstPolymer.step();

// PART 2
const secondPolymer = new Polymer(template, instructions);
for (let i = 0; i < 40; i++) secondPolymer.step();

// OUTPUTS
// const p = new Polymer(test[0][0], test[1]);
console.log(secondPolymer.characterCounts);
// console.log(`Part 1: ${}`);
// console.log(`Part 2: ${}`);
