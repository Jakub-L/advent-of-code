/**
 * Solution to Day 20 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/20
 */
import { readInput } from '../utils';

// TYPES

// INPUTS
const [lookup, rawImage] = readInput('./../../inputs/day-20.txt', '\n\n');
let image = rawImage.split('\n');
// let lookup =
//   '..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#';
// let image = ['#..#.', '#....', '##..#', '..#..', '..###'];

// UTILS
const getIndex = (i: number, j: number, image: string[]) =>
  parseInt(
    [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 0],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ].reduce((acc, [di, dj]) => `${acc}${image[i + di]?.[j + dj] === '#' ? 1 : 0}`, ''),
    2
  );

const expandImage = (lookup: string, image: string[]) => {
  const newImage = [];
  for (let i = -1; i <= image.length; i++) {
    let row = '';
    for (let j = -1; j <= image[0].length; j++) {
      const index = getIndex(i, j, image);
      row = `${row}${lookup[index]}`;
    }
    newImage.push(row);
  }
  return newImage;
};

const countLit = (image: string[]) =>
  image.reduce((acc, row) => acc + row.split('').filter((char) => char === '#').length, 0);
// PART 1

// PART 2

// OUTPUTS
console.log(image.length, image[0].length)
image = expandImage(lookup, image);
console.log(image.length, image[0].length)
// image = expandImage(lookup, image);
console.log(countLit(image))

// console.log(image);

// console.log(draw(expandImage(lookup, image)));
// console.log(`Part 1: ${}`);
// console.log(`Part 2: ${}`);
