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
  const bits = bin.split('');
  const ver = binToDec(bits.splice(0, 3).join(''));
  const type = binToDec(bits.splice(0, 3).join(''));
  if (type === 4) {
    let literal = '';
    do {
      const 
      [prefix, bit] = [bin.slice(0, 1), bin.slice(1, 5)];
      [bin, literal] = [bin.slice(5), `${literal}${bit}`];
    } while (prefix === '1');
    return { packet: { ver, type, val: binToDec(literal) }, rest: bin };
  } else {
    const lengthID = bin.slice(6, 7);
    const subPackets = [];
    if (lengthID === '0') {
      const subPacketLength = binToDec(bin.slice(7, 22));
      let content = bin.slice(22, 22 + subPacketLength);
      while (content.length) {
        const { packet, rest } = parsePacket(content);
        subPackets.push(packet);
        content = rest;
      }
      return {
        packet: { ver, type, subPackets },
        rest: bin.slice(22 + subPacketLength),
      };
    } else {
      const subPacketCount = binToDec(bin.slice(7, 18));
      let content = bin.slice(18);
      for (let i = 0; i < subPacketCount; i++) {
        const { packet, rest } = parsePacket(content);
        subPackets.push(packet);
        content = rest;
      }
      return { packet: { ver, type, subPackets }, rest: content };
    }
  }
};

// PART 1

// PART 2

// OUTPUTS

console.log(
  JSON.stringify(
    parsePacket(hexToBin('620080001611562C8802118E34')),
    undefined,
    4
  )
);
// console.log(`Part 1: ${}`);
// console.log(`Part 2: ${}`);
