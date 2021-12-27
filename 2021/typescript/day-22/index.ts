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
  dimensions: {
    x: Range;
    y: Range;
    z: Range;
  };
};

// INPUTS
const instructions = readInput('./../../inputs/day-22.txt').map(parseInstruction).reverse();

// UTILS
function parseInstruction(instruction: string): Instruction {
  const pattern = /(\w+).*x=(-*\d+)\.\.(-*\d+),y=(-*\d+)\.\.(-*\d+),z=(-*\d+)\.\.(-*\d+)/;
  const [_, operation, ...dimensionRanges] = instruction.match(pattern) || [];
  const [xmin, xmax, ymin, ymax, zmin, zmax] = dimensionRanges.map(Number);
  return {
    operation,
    dimensions: {
      x: { min: xmin, max: xmax },
      y: { min: ymin, max: ymax },
      z: { min: zmin, max: zmax },
    },
  };
}

class Cuboid {
  x: Range;
  y: Range;
  z: Range;

  constructor(x: Range, y: Range, z: Range) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  get volume() {
    return (
      (this.x.max - this.x.min + 1) *
      (this.y.max - this.y.min + 1) *
      (this.z.max - this.z.min + 1)
    );
  }

  static overlap(a: Cuboid, b: Cuboid): Cuboid | null {
    const overlap = new Cuboid(
      { min: Math.max(a.x.min, b.x.min), max: Math.min(a.x.max, b.x.max) },
      { min: Math.max(a.y.min, b.y.min), max: Math.min(a.y.max, b.y.max) },
      { min: Math.max(a.z.min, b.z.min), max: Math.min(a.z.max, b.z.max) }
    );
    if (
      overlap.x.max < overlap.x.min ||
      overlap.y.max < overlap.y.min ||
      overlap.z.max < overlap.z.min
    ) {
      return null;
    }
    return overlap;
  }

  toString() {
    return `x=${this.x.min}..${this.x.max},y=${this.y.min}..${this.y.max},z=${this.z.min}..${this.z.max}`;
  }
}
const findOverlapsVolume = (target: Cuboid, compared: Cuboid[]): number => {
  return compared
    .map((cube, i) => {
      const overlap = Cuboid.overlap(target, cube);
      if (overlap) return overlap.volume - findOverlapsVolume(overlap, compared.slice(i + 1));
      return 0;
    })
    .reduce((acc, n) => acc + n, 0);
};

// PART 1
let part1On = 0;
const part1Cubes: Cuboid[] = [];
for (let { operation, dimensions } of instructions) {
  const cuboid = new Cuboid(dimensions.x, dimensions.y, dimensions.z);
  if (
    cuboid.x.min >= -50 &&
    cuboid.x.max <= 50 &&
    cuboid.y.min >= -50 &&
    cuboid.y.max <= 50 &&
    cuboid.z.min >= -50 &&
    cuboid.z.max <= 50
  ) {
    if (operation === 'on') {
      part1On += cuboid.volume - findOverlapsVolume(cuboid, part1Cubes);
    }
    part1Cubes.push(cuboid);
  }
}

// PART 2
let part2On = 0;
const part2Cubes: Cuboid[] = [];
for (let { operation, dimensions } of instructions) {
  const cuboid = new Cuboid(dimensions.x, dimensions.y, dimensions.z);
  if (operation === 'on') part2On += cuboid.volume - findOverlapsVolume(cuboid, part2Cubes);
  part2Cubes.push(cuboid);
}

// OUTPUTS
console.log(`Part 1: ${part1On}`);
console.log(`Part 2: ${part2On}`);
