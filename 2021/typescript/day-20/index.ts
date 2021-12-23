/**
 * Solution to Day 20 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/20
 */
import { readInput } from '../utils';

// TYPES

// INPUTS
const [lookup, rawImage] = readInput('./../../inputs/day-20.txt', '\n\n');
let image = rawImage.split('\n');

// UTILS
/**
 * Finds the index of the new, enhanced pixel
 * @param {number} i - Row index of target pixel
 * @param {number} j - Column index of target pixel
 * @param {string[]} image - Array of strings representing the previous image iteration
 * @param {string} infVal - The value a pixel should take at infinity
 * @returns {number} - Decimal index of the new pixel value
 */
const getIndex = (i: number, j: number, image: string[], infVal: string): number =>
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
    ].reduce((acc, [di, dj]) => {
      if (image[i + di]?.[j + dj] === '#') return `${acc}1`;
      else if (image[i + di]?.[j + dj] === '.') return `${acc}0`;
      else return `${acc}${infVal === '#' ? 0 : 1}`;
    }, ''),
    2
  );

/**
 * Performs a single image enhancement pass on the specified image
 * @param {string} lookup - The image enhancement algorithm lookup string
 * @param {string[]} image - Array of strings representing the previous image iteration
 * @param {number} iteration - Which expansion it is. Used for looking up value at infinity
 * @returns {string[]} The new, enhanced image
 */
const expandOnce = (lookup: string, image: string[], iteration: number): string[] => {
  const infVal = iteration % 2 ? lookup[lookup.length - 1] : lookup[0];
  // const infVal = "."
  console.log(infVal);
  const newImage = [];
  for (let i = -1; i <= image.length; i++) {
    let row = '';
    for (let j = -1; j <= image[0].length; j++) {
      const index = getIndex(i, j, image, infVal);
      row = `${row}${lookup[index]}`;
    }
    newImage.push(row);
  }
  return newImage;
};

/**
 * Performs any number of the image enhancement algorithm. 
 * @param {string} lookup - The image enhancement algorithm lookup string
 * @param {string[]} image - Array of strings representing the input image
 * @param {number} iterations - How many iterations of the algorithm should take place
 * @returns {string[]} Enhanced image as a new array
 */
const expandImage = (lookup: string, image: string[], iterations: number) => {
  let newImage = Array.from(image);
  for (let iter = 0; iter < iterations; iter++) {
    newImage = expandOnce(lookup, newImage, iter);
  }
  return newImage;
};

/**
 * Counts the number of lit pixels in an image
 * @param {string[]} image - Array of strings representing the image
 * @returns {number} Number of lit pixels
 */
const countLit = (image: string[]): number =>
  image.reduce((acc, row) => acc + row.split('').filter((char) => char === '#').length, 0);

// PART 1
const firstImage = expandImage(lookup, image, 2);
console.log(countLit(firstImage));

// PART 2
const secondImage = expandImage(lookup, image, 50);

// OUTPUTS
console.log(`Part 1: ${countLit(firstImage)}`);
console.log(`Part 2: ${countLit(secondImage)}`);
