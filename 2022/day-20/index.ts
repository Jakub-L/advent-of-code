/**
 * Solution to Day 20 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/20
 */
import { readInput } from '../utils';

// INPUTS
const rawData: Element[] = readInput('./day-20/input.txt').map(e => ({ val: Number(e) }));

// UTILS
type Element = { val: number };

/** Object capable of processing encrypted inputs */
class Decryptor {
  /** Encrypted array */
  input: Element[];
  /** Decrypted array */
  output: Element[] = [];

  /**
   * Creates a new decryptor
   * @param {Element[]} rawData - Raw encrypted data
   * @param {number} [key=1] - Number to multiply each raw element by before processing
   */
  constructor(rawData: Element[], key: number = 1) {
    this.input = rawData.map(elem => ({ val: elem.val * key }));
  }

  /**
   * Decrypts the input
   * @param {number} [repeats=1] - Number of times to repeat the decryption process
   * @returns {Decryptor} This decryptor object after updating its output
   */
  decrypt(repeats: number = 1): Decryptor {
    const result = [...this.input];
    for (let i = 0; i < repeats; i++) {
      for (const element of this.input) {
        const oldIndex = result.indexOf(element);
        result.splice(oldIndex, 1);
        const newIndex = (oldIndex + element.val) % result.length;
        result.splice(newIndex, 0, element);
      }
    }
    this.output = result;
    return this;
  }

  /** Coordinates of the grove */
  get coordinates(): number {
    const zeroIndex = this.output.findIndex(e => e.val === 0);
    return (
      this.output[(zeroIndex + 1000) % this.output.length].val +
      this.output[(zeroIndex + 2000) % this.output.length].val +
      this.output[(zeroIndex + 3000) % this.output.length].val
    );
  }
}

// RESULTS
console.log(`Part 1 solution: ${new Decryptor(rawData).decrypt().coordinates}`);
console.log(`Part 2 solution: ${new Decryptor(rawData, 811589153).decrypt(10).coordinates}`);
