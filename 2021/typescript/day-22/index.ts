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
const instructions = readInput('./../../inputs/day-22.txt').map(parseInstruction);
const t = [
  'on x=-20..26,y=-36..17,z=-47..7',
  'on x=-20..33,y=-21..23,z=-26..28',
  'on x=-22..28,y=-29..23,z=-38..16',
  'on x=-46..7,y=-6..46,z=-50..-1',
  'on x=-49..1,y=-3..46,z=-24..28',
  'on x=2..47,y=-22..22,z=-23..27',
  'on x=-27..23,y=-28..26,z=-21..29',
  'on x=-39..5,y=-6..47,z=-3..44',
  'on x=-30..21,y=-8..43,z=-13..34',
  'on x=-22..26,y=-27..20,z=-29..19',
  'off x=-48..-32,y=26..41,z=-47..-37',
  'on x=-12..35,y=6..50,z=-50..-2',
  'off x=-48..-32,y=-32..-16,z=-15..-5',
  'on x=-18..26,y=-33..15,z=-7..46',
  'off x=-40..-22,y=-38..-28,z=23..41',
  'on x=-16..35,y=-41..10,z=-47..6',
  'off x=-32..-23,y=11..30,z=-14..3',
  'on x=-49..-5,y=-3..45,z=-29..18',
  'off x=18..30,y=-20..-8,z=-3..13',
  'on x=-41..9,y=-7..43,z=-33..15',
  'on x=-54112..-39298,y=-85059..-49293,z=-27449..7877',
  'on x=967..23432,y=45373..81175,z=27513..53682',
].map(parseInstruction);

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

for (let { operation, dimensions } of instructions.reverse()) {
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

for (let { operation, dimensions } of instructions.reverse()) {
  const cuboid = new Cuboid(dimensions.x, dimensions.y, dimensions.z);
  if (operation === 'on') {
    part2On += cuboid.volume - findOverlapsVolume(cuboid, part2Cubes);
  }
  part2Cubes.push(cuboid);
}

// OUTPUTS
console.log(`Part 1: ${part1On}`);
console.log(`Part 2: ${part2On}`);
