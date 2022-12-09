/**
 * Solution to Day 8 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/8
 */
import { readInput } from '../utils';

// INPUTS
const heights: number[][] = readInput('./day-08/input.txt')
  .map(row => row.split('').map(Number));

// UTILS
/** A 2-dimensional arrangement of trees */
class Forest {
  heights: number[][];
  visibleTrees: number = 0;
  highestScenicScore: number = 0;

  /**
   * Creates a new forest
   * @param {number[][]} heights - 2D array of tree heights
   */
  constructor(heights: number[][]) {
    this.heights = heights;
    for (let i = 0; i < this.heights.length; i++) {
      for (let j = 0; j < this.heights[i].length; j++) {
        const visibility =
          this.isVisibleBottom(i, j) ||
          this.isVisibleLeft(i, j) ||
          this.isVisibleRight(i, j) ||
          this.isVisibleTop(i, j);
        const scenicScore =
          this.viewingDistanceLeft(i, j) *
          this.viewingDistanceRight(i, j) *
          this.viewingDistanceDown(i, j) *
          this.viewingDistanceUp(i, j);


        this.visibleTrees += Number(visibility)
        this.highestScenicScore = Math.max(scenicScore, this.highestScenicScore)
      }
    }
  }

  /**
   * Checks if a tree can be seen from the left edge of the forest
   * @param {number} row - Horizontal position of the tree in the forest
   * @param {number} col - Vertical position of the tree in the forest
   * @returns {boolean} True if the tree can be seen
   */
  private isVisibleLeft(row: number, col: number): boolean {
    for (let i = 0; i < col; i++) {
      if (this.heights[row][i] >= this.heights[row][col]) return false;
    }
    return true;
  }

  /**
   * Checks if a tree can be seen from the right edge of the forest
   * @param {number} row - Horizontal position of the tree in the forest
   * @param {number} col - Vertical position of the tree in the forest
   * @returns {boolean} True if the tree can be seen
   */
  private isVisibleRight(row: number, col: number): boolean {
    for (let i = col + 1; i < this.heights[row].length; i++) {
      if (this.heights[row][i] >= this.heights[row][col]) return false;
    }
    return true;
  }

  /**
   * Checks if a tree can be seen from the top edge of the forest
   * @param {number} row - Horizontal position of the tree in the forest
   * @param {number} col - Vertical position of the tree in the forest
   * @returns {boolean} True if the tree can be seen
   */
  private isVisibleTop(row: number, col: number): boolean {
    for (let j = 0; j < row; j++) {
      if (this.heights[j][col] >= this.heights[row][col]) return false;
    }
    return true;
  }

  /**
   * Checks if a tree can be seen from the bottom edge of the forest
   * @param {number} row - Horizontal position of the tree in the forest
   * @param {number} col - Vertical position of the tree in the forest
   * @returns {boolean} True if the tree can be seen
   */
  private isVisibleBottom(row: number, col: number): boolean {
    for (let j = row + 1; j < this.heights.length; j++) {
      if (this.heights[j][col] >= this.heights[row][col]) return false;
    }
    return true;
  }

  /**
   * Sees what the viewing distance is when looking left from a tree
   * @param {number} row - Horizontal position of the tree in the forest
   * @param {number} col - Vertical position of the tree in the forest
   * @returns {number} Number of trees that can be seen from the location
   */
  private viewingDistanceLeft(row: number, col: number): number {
    for (let i = col - 1; i >= 0; i--) {
      if (this.heights[row][i] >= this.heights[row][col]) return col - i;
    }
    return col;
  }

  /**
   * Sees what the viewing distance is when looking right from a tree
   * @param {number} row - Horizontal position of the tree in the forest
   * @param {number} col - Vertical position of the tree in the forest
   * @returns {number} Number of trees that can be seen from the location
   */
  private viewingDistanceRight(row: number, col: number): number {
    for (let i = col + 1; i < this.heights[row].length; i++) {
      if (this.heights[row][i] >= this.heights[row][col]) return i - col;
    }
    return this.heights[0].length - col - 1;
  }

  /**
   * Sees what the viewing distance is when looking up from a tree
   * @param {number} row - Horizontal position of the tree in the forest
   * @param {number} col - Vertical position of the tree in the forest
   * @returns {number} Number of trees that can be seen from the location
   */
  private viewingDistanceUp(row: number, col: number): number {
    for (let i = row - 1; i >= 0; i--) {
      if (this.heights[i][col] >= this.heights[row][col]) return row - i;
    }
    return row;
  }

  /**
   * Sees what the viewing distance is when looking down from a tree
   * @param {number} row - Horizontal position of the tree in the forest
   * @param {number} col - Vertical position of the tree in the forest
   * @returns {number} Number of trees that can be seen from the location
   */
  private viewingDistanceDown(row: number, col: number): number {
    for (let i = row + 1; i < this.heights.length; i++) {
      if (this.heights[i][col] >= this.heights[row][col]) return i - row;
    }
    return this.heights.length - row - 1;
  }
}

// PARTS 1 & 2
const forest = new Forest(heights);

// RESULTS
console.log(`Part 1 solution: ${forest.visibleTrees}`);
console.log(`Part 2 solution: ${forest.highestScenicScore}`);
