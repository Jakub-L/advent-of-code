/**
 * Solution to Day 2 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/2
 */
import { readInput } from '../utils';

// INPUTS
const instructions = readInput('./../../inputs/day-02.txt');

// UTILS
/** Class representing a Submarine */
class Submarine {
  position: number;
  depth: number;
  aim: number;
  useAim: boolean;

  /**
   * Create a submarine. The position defaults to 0, 0
   * @param {boolean} useAim - Boolean to decide if the aim parameter should be used
   */
  constructor(useAim = true) {
    this.position = 0;
    this.depth = 0;
    this.aim = 0;
    this.useAim = useAim;
  }

  /**
   * Moves the submarine according to the passed instruction
   * @param {string} instruction - forward/up/down followed by a number, representing the number of units to move
   */
  move(instruction: string) {
    const [direction, value] = instruction.split(' ');
    const intValue: number = parseInt(value, 10);
    switch (direction) {
      case 'up':
        if (this.useAim) this.aim -= intValue;
        else this.depth -= intValue;
        break;
      case 'down':
        if (this.useAim) this.aim += intValue;
        else this.depth += intValue;
        break;
      case 'forward':
        this.position += intValue;
        if (this.useAim) this.depth += intValue * this.aim;
        break;
      default:
        break;
    }
  }
}

// PART 1
const firstSub = new Submarine(false);
for (let instruction of instructions) {
  firstSub.move(instruction);
}

// PART 2
const secondSub = new Submarine();
for (let instruction of instructions) {
  secondSub.move(instruction);
}

// Outputs
console.log(`Part 1: ${firstSub.position * firstSub.depth}`);
console.log(`Part 2: ${secondSub.position * secondSub.depth}`);
