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
    packet.content = val;
    if (binToDec(rest) === 0) {
      return [packet, ''];
    } else {
      return [packet, rest];
    }
  } else {
    const lengthID = bin.slice(6, 7);
    if (lengthID === '0') {
      const subPacketLength = binToDec(bin.slice(7, 22));
      let [subPacket, rest] = parsePacket(bin.slice(22, 22 + subPacketLength));
      packet.content = [subPacket];
      while (rest.length) {
        [subPacket, rest] = parsePacket(rest);
        packet.content.push(subPacket);
      }
      return [packet, ''];
    } else {
      const subPacketCount = binToDec(bin.slice(7, 18));
      let [subPacket, rest] = parsePacket(bin.slice(18));
      packet.content = [subPacket];
      while (packet.content.length < subPacketCount) {
        [subPacket, rest] = parsePacket(rest);
        packet.content.push(subPacket);
      }
      return [packet, ''];
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
// console.dir(
//   parsePacket('00111000000000000110111101000101001010010001001000000000')
// );
// '100010100000000001001010100000000001101010000000000000101111010001111000';
console.log(
  JSON.stringify(
    parsePacket(hexToBin('C0015000016115A2E0802F182340'))[0],
    undefined,
    4
  )
);
// console.log(`Part 1: ${}`);
// console.log(`Part 2: ${}`);
