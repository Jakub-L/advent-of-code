/**
 * Solution to Day 10 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/10
 */
import { readInput } from '../utils';

// INPUTS
const instructions: string[] = readInput('./day-10/input.txt');

// UTILS
/** A CPU processing instructions */
class CPU {
  private register: number = 1;
  registerHistory: number[] = [NaN];

  /** Create a new CPU */
  constructor() {}

  /**
   * Processes a program in the CPU
   * @param {string[]} program - Array of instructions
   */
  processProgram(program: string[]) {
    for (const instruction of program) {
      this.processInstruction(instruction);
    }
    this.registerHistory.push(this.register);
  }

  /**
   * Returns the sum of signal strengths
   * @param {number} startCycle - First cycle at which calculation is to be done
   * @param {number} cycleFrequency - How frequently the calculation is to be done
   *    after the startCycle
   * @returns {number} Sum of signal strengths at cycles of interest
   */
  getSignalStrengthSum(startCycle: number, cycleFrequency: number): number {
    let sum = 0;
    for (let i = startCycle; i <= this.registerHistory.length; i += cycleFrequency) {
      sum += i * this.registerHistory[i];
    }
    return sum;
  }

  /**
   * Processes a single instruction on the CPU
   * @param {string} instruction - Instruction string
   */
  private processInstruction(instruction: string) {
    const [command, argument] = instruction.split(' ');
    // Default `noop` behaviour
    this.registerHistory.push(this.register);
    if (command === 'addx') {
      // Additional behaviour for `addx`
      this.registerHistory.push(this.register);
      this.register += Number(argument);
    }
  }
}

// PART 1
const cpu = new CPU();
cpu.processProgram(instructions);

// PART 2
/**
 * Draws a CRT screen based on the register sprite positions
 * @param {number[]} registerHistory - Values of the register at each cycle
 * @param {number} [spriteWidth=3] - Width of the sprite, in pixels
 * @param {number} [rowWidth=40] - Width of a CRT screen row, in pixels
 * @returns {string} A string representing the CRT screen
 */
const drawCRT = (
  registerHistory: number[],
  spriteWidth: number = 3,
  rowWidth: number = 40
): string => {
  const screen: string[] = [];
  const maxIndexDistance = (spriteWidth - 1) / 2;
  let row: string = '';
  for (let i = 1; i <= registerHistory.length; i++) {
    if (i % rowWidth === 1 && i > 1) {
      screen.push(row);
      row = '';
    }
    if (Math.abs(registerHistory[i] - ((i - 1) % rowWidth)) <= maxIndexDistance) {
      row = `${row}█`;
    } else row = `${row} `;
  }
  return screen.join('\n');
};

// RESULTS
console.log(`Part 1 solution: ${cpu.getSignalStrengthSum(20, 40)}`);
console.log(`Part 2 solution:\n${drawCRT(cpu.registerHistory)}`);
