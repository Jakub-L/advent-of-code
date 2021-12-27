/**
 * Solution to Day 22 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/22
 */
import { readInput } from '../utils';

// TYPES
type Range = {
  min: number;
  max: number;
};
type Instruction = {
  operation: string;
  x: Range;
  y: Range;
  z: Range;
};

// INPUTS
const instructions = readInput('./../../inputs/day-22.txt');
const t = [
  'on x=10..12,y=10..12,z=10..12',
  'on x=11..13,y=11..13,z=11..13',
  'off x=9..11,y=9..11,z=9..11',
  'on x=10..10,y=10..10,z=10..10',
].map(parseInstruction);

// UTILS
function parseInstruction(instruction: string): Instruction {
  const pattern = /(\w+).*x=(\d+)\.\.(\d+),y=(\d+)\.\.(\d+),z=(\d+)\.\.(\d+)/;
  const [_, operation, ...dimensionRanges] = instruction.match(pattern) || [];
  const [xmin, xmax, ymin, ymax, zmin, zmax] = dimensionRanges.map(Number);
  return {
    operation,
    x: { min: xmin, max: xmax },
    y: { min: ymin, max: ymax },
    z: { min: zmin, max: zmax },
  };
}

// PART 1

// PART 2

// OUTPUTS
console.log(t);
// console.log(`Part 1: ${}`);
// console.log(`Part 2: ${}`);
