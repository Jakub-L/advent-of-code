/**
 * Solution to Day 16 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/16
 */
import { readInput } from '../utils';

// TYPES
/** Single packet */
type Packet = {
  ver: number;
  type: number;
  val?: number;
  subPackets?: Packet[];
};

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

/**
 * Parses a binary packet string into a hierarchy of packets
 * @param {string} binary - The binary representation of the packet string
 * @returns {Object} The parsed packet and the rest of the input data
 */
const parsePacket = (binary: string): { packet: Packet; rest: string } => {
  const bits = binary.split('');
  const ver = binToDec(bits.splice(0, 3).join(''));
  const type = binToDec(bits.splice(0, 3).join(''));

  if (type === 4) {
    let literal = '';
    let prefix, bit;
    do {
      [prefix, bit] = [
        bits.splice(0, 1).join(''),
        bits.splice(0, 4).join('').padEnd(4, '0'),
      ];
      literal = `${literal}${bit}`;
    } while (prefix === '1');
    return {
      packet: { ver, type, val: binToDec(literal) },
      rest: bits.join(''),
    };
  } else {
    const lengthID = bits.splice(0, 1).join('');
    if (lengthID === '0') {
      const subPacketLength = binToDec(bits.splice(0, 15).join(''));
      const subPackets = [];
      let subPacketContent = bits.splice(0, subPacketLength).join('');
      while (subPacketContent.length > 0) {
        const { packet, rest } = parsePacket(subPacketContent);
        subPackets.push(packet);
        subPacketContent = rest;
      }
      return {
        packet: { ver, type, subPackets },
        rest: bits.join(''),
      };
    } else {
      const subPacketCount = binToDec(bits.splice(0, 11).join(''));
      const subPackets = [];
      let subPacketContent = bits.join('');
      for (let i = 0; i < subPacketCount; i++) {
        const { packet, rest } = parsePacket(subPacketContent);
        subPackets.push(packet);
        subPacketContent = rest;
      }
      return { packet: { ver, type, subPackets }, rest: subPacketContent };
    }
  }
};

// PART 1

// PART 2

// OUTPUTS
// console.log(`Part 1: ${}`);
// console.log(`Part 2: ${}`);
