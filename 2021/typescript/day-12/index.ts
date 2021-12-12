/**
 * Solution to Day 12 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/12
 */
import { readInput } from '../utils';

// INPUTS
const caves = readInput('./../../inputs/day-12.txt').map((pair) =>
  pair.split('-')
);

const test = ['start-A', 'start-b', 'A-c', 'A-b', 'b-d', 'A-end', 'b-end'].map(
  (pair) => pair.split('-')
);

// UTILS
class Cave {
  id: string;
  connections: Cave[];
  isLarge: boolean;

  constructor(id: string) {
    this.id = id;
    this.connections = [];
    this.isLarge = /[A-Z]+/.test(id);
  }

  join(target: Cave) {
    this.connections.push(target);
    target.connections.push(this);
  }
}

class System {
  caves: { [index: string]: Cave };

  constructor(pairs: string[][]) {
    this.caves = {};
    for (let pair of pairs) {
      const caves = pair.map((id) => this.caves[id] || new Cave(id));
      caves.forEach((cave) => (this.caves[cave.id] = cave));
      caves[0].join(caves[1]);
    }
  }

  countPaths(visitTwice: boolean, start?: Cave, visited?: string[]): number {
    visited = visited || ['start'];
    start = start || this.caves['start'];
    let routes = 0;
    if (start.id === 'end') return 1;
    for (let connection of start.connections) {
      if (connection.isLarge)
        routes += this.countPaths(visitTwice, connection, visited);
      else {
        if (!visited.includes(connection.id)) {
          routes += this.countPaths(visitTwice, connection, [
            ...visited,
            connection.id
          ]);
        } else if (visitTwice && !['start', 'end'].includes(connection.id)) {
          routes += this.countPaths(false, connection, [
            ...visited,
            connection.id
          ]);
        }
      }
    }
    return routes;
  }
}

// PART 1

// PART 2

// OUTPUTS
const a = new System(caves);
console.log(a.countPaths(false));
console.log(a.countPaths(true));

// console.log(`Part 1: ${}`);
// console.log(`Part 2: ${}`);
