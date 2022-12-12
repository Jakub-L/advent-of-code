/**
 * Solution to Day 12 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/12
 */
import { readInput } from '../utils';

// INPUTS
const rawHeightMap: string[][] = readInput('./day-12/input.txt').map(row => row.split(''));

// UTILS
type Point = [number, number];

/**
 * Finds all occurences of an item in a 2D array. Uses strict equality (===)
 * @param {T} item - Item to find
 * @param {T[][]} arr - 2D array to search
 * @returns {Point[]} [row, column] array of locations of the item
 * @template T
 */
const findIn2dArray = <T>(item: T, arr: T[][]): Point[] => {
  const output: Point[] = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] === item) output.push([i, j]);
    }
  }
  return output;
};

/**
 * Parses a raw height map to numbers representing their height
 * @param {string[][]} rawHeightMap - 2D array with letter-labelled levels
 * @returns {number[][]} 2D array with heights
 */
const parseMap = (rawHeightMap: string[][]): number[][] =>
  rawHeightMap.map(row =>
    row.map(char => {
      if (char === 'S') return 0;
      else if (char === 'E') return 25;
      else return char.charCodeAt(0) - 97;
    })
  );

/** A 2D map */
class Map {
  currentLocation: Point;
  destination: Point;
  lowestElevations: Point[];
  heightMap: number[][];

  /**
   * Creates a new Map
   * @param {string[][]} rawHeightMap - 2D array with letter-labelled levels
   */
  constructor(rawHeightMap: string[][]) {
    this.currentLocation = findIn2dArray('S', rawHeightMap)[0];
    this.destination = findIn2dArray('E', rawHeightMap)[0];
    this.heightMap = parseMap(rawHeightMap);
    this.lowestElevations = findIn2dArray(0, this.heightMap);
  }

  /**
   * Finds the shortest number of steps from current location to best signal location
   * @returns {number} Shortest distance possible
   */
  shortestPathToBestSignal(): number {
    return this.findShortestPath(this.currentLocation, this.destination);
  }

  /**
   * Finds the shortest number of steps from best signal location to any location at lowest elevation
   * @returns {number} Shortest distance possible
   */
  shortestPathToLowestElevation(): number {
    return this.lowestElevations
      .map(start => this.findShortestPath(start, this.destination))
      .filter(dist => dist > 0)
      .sort((a, b) => a - b)[0];
  }

  /**
   * Searches through a grid of numbers using Dijkstra's algorithm to find the shortest path between
   * the start and end. Assumes only vertical and horizontal movement is allowed. Only permits
   * movement if the difference between heights is within limit.
   *
   * Based on the generic implementation in utils.ts
   *
   * @param {Point} start - The starting coordinates of the search [y, x]
   * @param {Point} end - The end coordinates of the search [y, x]
   * @returns {number} Length of path between start and end
   */
  private findShortestPath(start: Point, end: Point): number {
    // prettier-ignore
    const neighbours = [[-1, 0], [0, -1], [0, 1], [1, 0]];
    const visited = new Set();
    const [ys, xs] = start;
    const [ye, xe] = end;
    const queue = [{ x: xs, y: ys, dist: 0, height: 0 }];

    while (queue.length) {
      const { x = 0, y = 0, dist = 0 } = queue.shift() || {};
      // If at the end, return travelled distance. Otherwise, check neighbours
      if (x === xe && y === ye) return dist;
      for (let [dx, dy] of neighbours) {
        const [xx, yy] = [x + dx, y + dy];
        // If point is outside grid bounds, has been visited, or has too big a height rise skip it
        if (
          this.heightMap[yy]?.[xx] === undefined ||
          visited.has(`${xx},${yy}`) ||
          this.heightMap[yy][xx] - this.heightMap[y][x] > 1
        ) {
          continue;
        }
        // Otherwise mark point as visited and add it to the queue to check
        visited.add(`${xx},${yy}`);
        queue.push({ x: xx, y: yy, dist: dist + 1, height: this.heightMap[yy][xx] });
      }
      // Sort the queue to find the shortest-distance vertex to inspect next
      queue.sort((a, b) => a.dist - b.dist);
    }
    return -1;
  }
}

// PART 1 & 2
const map = new Map(rawHeightMap);

// RESULTS
console.log(`Part 1 solution: ${map.shortestPathToBestSignal()}`);
console.log(`Part 2 solution: ${map.shortestPathToLowestElevation()}`);
