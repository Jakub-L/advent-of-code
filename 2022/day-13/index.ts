/**
 * Solution to Day 13 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/13
 */
import { readInput } from '../utils';

// INPUTS
const packetsAsPairs: Packet[][] = readInput('./day-13/input.txt', '\n\n').map(pair =>
  pair.split('\n').map(str => JSON.parse(str))
);
const packetsAsList: Packet[][] = readInput('./day-13/input.txt')
  .filter(row => row.length !== 0)
  .map(str => JSON.parse(str))
  .concat([[[2]], [[6]]]);

// UTILS
type Packet = Array<number | Packet>;

/**
 * Wraps a number into an array, if it isn't an array already
 * @param {number | Packet} elem - Element to wrap
 * @returns {Packet} The input in the form of a Packet
 */
const toPacket = (elem: number | Packet): number[] | Packet =>
  typeof elem === 'number' ? [elem] : elem;

/**
 * Compares a pair of packets to see if they are in the correct order
 * @param {Packet[]} pair - A pair of packets to compare
 * @returns {boolean | null} True if in correct order, false if in incorrect,
 *    null if unable to determine
 */
const isInRightOrder = ([first, second]: Packet[]): boolean | null => {
  for (let i = 0; i < Math.min(first.length, second.length); i++) {
    const [a, b] = [first[i], second[i]];
    if (typeof a === 'number' && typeof b === 'number') {
      if (a === b) continue;
      return a < b;
    }
    const result = isInRightOrder([toPacket(a), toPacket(b)]);
    if (result === null) continue;
    return result;
  }
  if (first.length === second.length) return null;
  return first.length < second.length;
};

// PART 1
const sumOfCorrectIndices = packetsAsPairs.reduce(
  (sum, pair, i) => sum + (isInRightOrder(pair) ? i + 1 : 0),
  0
);

// PART 2
const decoderKey = packetsAsList
  .sort((a, b) => (isInRightOrder([a, b]) ? -1 : 1))
  .map(packets => JSON.stringify(packets))
  .reduce((acc, packet, i) => acc * (['[[2]]', '[[6]]'].includes(packet) ? i + 1 : 1), 1);

// RESULT
console.log(`Part 1 solution: ${sumOfCorrectIndices}`);
console.log(`Part 2 solution: ${decoderKey}`);
