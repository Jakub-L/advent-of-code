/**
 * Solution to Day 2 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/2
 */
import { readInput } from '../utils';

// INPUTS
const instructions = readInput('./../../inputs/day-02.txt');

// UTILS
/** Class representing a basic submarine without aim */
class BasicSubmarine {
  position: number;
  depth: number;

  /** Create a submarine. The position and depth defaults to 0, 0 */
  constructor() {
    this.position = 0;
    this.depth = 0;
  }

  /**
   * Moves the submarine according to the passed instruction
   * @param {string} instruction - forward/up/down followed by a number, representing the number of units to move
   */
  move(instruction: string) {
    const [dir, strVal] = instruction.split(' ');
    const val: number = parseInt(strVal, 10);
    switch (dir) {
      case 'up':
        this.depth -= val;
        break;
      case 'down':
        this.depth += val;
        break;
      case 'forward':
        this.position += val;
        break;
    }
  }
}

/** Class representing a submarine with aim functionality */
class Submarine extends BasicSubmarine {
  aim: number;

  /** Create a submarine. The position, aim and depth defaults to 0, 0, 0 */
  constructor() {
    super();
    this.aim = 0;
  }

  /**
   * Moves the submarine according to the passed instruction
   * @param {string} instruction - forward/up/down followed by a number, representing the number of units to move
   */
  move(instruction: string) {
    const [dir, strVal] = instruction.split(' ');
    const val: number = parseInt(strVal, 10);
    switch (dir) {
      case 'up':
        this.aim -= val;
        break;
      case 'down':
        this.aim += val;
        break;
      case 'forward':
        this.position += val;
        this.depth += val * this.aim;
        break;
    }
  }
}

// PART 1 & 2
const firstSub = new BasicSubmarine();
const secondSub = new Submarine();

for (let instruction of instructions) {
  firstSub.move(instruction);
  secondSub.move(instruction);
}

// Outputs
console.log(`Part 1: ${firstSub.position * firstSub.depth}`);
console.log(`Part 2: ${secondSub.position * secondSub.depth}`);
