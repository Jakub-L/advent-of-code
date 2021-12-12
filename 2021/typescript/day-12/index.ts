/**
 * Solution to Day 12 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/12
 */
import { readInput } from '../utils';

// INPUTS
const caves = readInput('./../../inputs/day-12.txt').map((pair) =>
  pair.split('-')
);

// UTILS
/** Class representing a single cave */
class Cave {
  id: string;
  connections: Cave[];
  isLarge: boolean;

  /**
   * Generates a new cave
   * @param {string} id - ID of the cave
   */
  constructor(id: string) {
    this.id = id;
    this.connections = [];
    this.isLarge = /[A-Z]+/.test(id);
  }

  /**
   * Joins two caves together with a traversable, bidirecitonal edge
   * @param {Cave} target - The cave to which connection is created
   */
  join(target: Cave) {
    this.connections.push(target);
    target.connections.push(this);
  }
}

/** Class representing a system of interconnected caves */
class CaveSystem {
  caves: { [index: string]: Cave };

  /**
   * Create a new cave system
   * @param {string[][]} pairs - Array of cave ID pairs, representing their connections
   */
  constructor(pairs: string[][]) {
    this.caves = {};
    for (let pair of pairs) {
      const caves = pair.map((id) => this.caves[id] || new Cave(id));
      caves.forEach((cave) => (this.caves[cave.id] = cave));
      caves[0].join(caves[1]);
    }
  }

  /**
   * Counts the number of ways to traverse the system starting at `node` and finishing at
   * a cave with ID "end"
   * @param {boolean} visitTwice - Whether small caves can be visited twice
   * @param {Cave} [node=this.caves['start']] - The node at which to start the search
   * @param {string[]} [visited=['start']] - Array of IDs of visited small caves
   * @returns {number} The number of distinct routes
   */
  countPaths(
    visitTwice: boolean,
    node = this.caves['start'],
    visited = ['start']
  ): number {
    let routes = 0;
    if (node.id === 'end') return 1;
    for (let cave of node.connections) {
      if (cave.isLarge) routes += this.countPaths(visitTwice, cave, visited);
      else {
        if (!visited.includes(cave.id)) {
          routes += this.countPaths(visitTwice, cave, [...visited, cave.id]);
        } else if (visitTwice && !['start', 'end'].includes(cave.id)) {
          routes += this.countPaths(false, cave, visited);
        }
      }
    }
    return routes;
  }
}

// PART 1 & 2
const network = new CaveSystem(caves);

// OUTPUTS
console.log(`Part 1: ${network.countPaths(false)}`);
console.log(`Part 2: ${network.countPaths(true)}`);
