/**
 * Solution to Day 16 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/16
 */
import { readInput } from '../utils';

// INPUTS
const input = readInput('./../../inputs/day-16.txt');

// UTILS
/**
 * Converts a hexadecimal string to binary, with each hexadecimal digit converted to 4-bits
 * @param {string} hex - Hexadecimal string
 * @returns {string} Binary representation of the input string
 */
const hexToBin = (hex: string): string =>
  hex
    .split('')
    .map((c) => parseInt(c, 16).toString(2).padStart(4, '0'))
    .join('');

/**
 * Converts a binary string to a decimal number
 * @param {string} bin - Binary string
 * @returns {number} Decimal number representation of the input string
 */
const binToDec = (bin: string) => parseInt(bin, 2);

const parsePacket = (bin: string): any => {
  const [ver, type] = [binToDec(bin.slice(0, 3)), binToDec(bin.slice(3, 6))];
  const packet: { [index: string]: any } = { ver, type };
  if (type === 4) {
    const { val, rest } = parseLiteral(bin.slice(6));
    if (binToDec(rest) === 0) {
      packet.content = val;
      return packet;
    }
  } else {
    const lengthID = bin.slice(6, 7);
    if (lengthID === "0") {
      
    }
  }
};

const parseLiteral = (bin: string) => {
  let num = '';
  let prefix, bit;
  do {
    [prefix, bit] = [bin.slice(0, 1), bin.slice(1, 5)];
    [bin, num] = [bin.slice(5), `${num}${bit}`];
  } while (bin.length >= 4 && prefix === '1');
  return { val: binToDec(num), rest: bin };
};

// PART 1

// PART 2

// OUTPUTS

// console.log(parsePacket('110100101111111000101000'));
console.log(
  parsePacket('00111000000000000110111101000101001010010001001000000000')
);
// console.log(`Part 1: ${}`);
// console.log(`Part 2: ${}`);
