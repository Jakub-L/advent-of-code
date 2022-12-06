/**
 * Solution to Day 5 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/5
 */
import { readInput } from '../utils';

// TYPES & CLASSES
type CrateMover = '9000' | '9001';

/** A single instruction */
class Instruction {
  quantity: number;
  source: number;
  target: number;

  /** Creates a new instruction
   * @param {number} quantity - The number of crates to move
   * @param {number} source - The source stack, 1-indexed
   * @param {number} target - The target stack, 1-indexed
   */
  constructor([quantity, source, target]: [number, number, number]) {
    this.quantity = quantity;
    this.source = source;
    this.target = target;
  }
}

/** Cargo stored in vertical stacks */
class Cargo {
  stacks: string[][];

  /**
   * Creates a new cargo collection
   * @param {string[][]} stacks - Initial ordering of the stacks, from bottom crate to top
   */
  constructor(stacks: string[][]) {
    this.stacks = stacks.map(row => row.slice());
  }

  /**
   * Processes a single instruction
   * @param {Instruction} instr - Instruction to process
   * @param {CrateMover} type - Type of cratemover to use, with 9000 moving crates individually
   *    and 9001 moving crates in one group
   */
  processInstruction(instr: Instruction, type: CrateMover) {
    if (type === '9000') {
      for (let i = 0; i < instr.quantity; i++) {
        const crate = this.stacks[instr.source - 1].pop();
        if (crate) this.stacks[instr.target - 1].push(crate);
      }
    } else if (type === '9001') {
      const crates = this.stacks[instr.source - 1].slice(-instr.quantity);
      this.stacks[instr.source - 1] = this.stacks[instr.source - 1].slice(0, -instr.quantity);
      this.stacks[instr.target - 1] = this.stacks[instr.target - 1].concat(crates);
    }
  }

  /** Gets the letters of crates on top of each stack  */
  get topCrates(): string {
    return this.stacks.map(crate => crate[crate.length - 1]).join('');
  }
}

// INPUTS
const crates = [
  ['R', 'P', 'C', 'D', 'B', 'G'],
  ['H', 'V', 'G'],
  ['N', 'S', 'Q', 'D', 'J', 'P', 'M'],
  ['P', 'S', 'L', 'G', 'D', 'C', 'N', 'M'],
  ['J', 'B', 'N', 'C', 'P', 'F', 'L', 'S'],
  ['Q', 'B', 'D', 'Z', 'V', 'G', 'T', 'S'],
  ['B', 'Z', 'M', 'H', 'F', 'T', 'Q'],
  ['C', 'M', 'D', 'B', 'F'],
  ['F', 'C', 'Q', 'G']
];
const instructions: Instruction[] = readInput('./day-05/input.txt', '\n\n')[1]
  .split('\n')
  .map(str => str.match(/\d+/g)?.map(Number) as [number, number, number])
  .map(instr => new Instruction(instr));

// PART 1
/**
 * Performs specified operations on cargo, then returns the top crates
 * @param {Cargo} cargo - The Cargo to perform the movements on
 * @param {Instruction[]} instructions - Set of instructions to follow
 * @param {CrateMover} type - Type of cratemover used, either moving crates one-by-one,
 *    or all crates at once.
 * @returns {string} Combined letters from crates on top of each stack
 */
const getTopCratesAfterInstructions = (
  cargo: Cargo,
  instructions: Instruction[],
  type: CrateMover
): string => {
  for (const instr of instructions) cargo.processInstruction(instr, type);
  return cargo.topCrates;
};

// RESULTS
console.log(
  `Part 1 solution: ${getTopCratesAfterInstructions(new Cargo(crates), instructions, '9000')}`
);
console.log(
  `Part 2 solution: ${getTopCratesAfterInstructions(new Cargo(crates), instructions, '9001')}`
);
