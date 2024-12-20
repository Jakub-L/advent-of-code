import { Queue } from "@jakub-l/aoc-lib/data-structures";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// Types
type Node = { x: number; y: number; dist: number };

// Constants
// prettier-ignore
const DIR: [number, number][] = [[0, 1], [1, 0], [0, -1], [-1, 0]];

// Inputs
const input: string[][] = readFile(`${__dirname}/input.txt`, ["\n", ""]) as string[][];

// Part 1 & 2
/**
 * Finds the Manhattan distance between two nodes
 * @param {Node} a - The first node
 * @param {Node} b - The second node
 * @returns {number} The Manhattan distance between the two nodes
 */
const manhattan = (a: Node, b: Node): number => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

/**
 * Finds the distances between the starting node and all other nodes.
 * This is effectively the distance along the track of every track grid location.
 *
 * @param {string[][]} layout - The layout of the warehouse
 * @returns {Record<string, Node>} The distances from the start
 */
const getDistances = (layout: string[][]): Record<string, Node> => {
  let start: Node = { x: -1, y: -1, dist: Infinity };

  // Find the starting node
  for (let y = 0; y < layout.length; y++) {
    for (let x = 0; x < layout[y].length; x++) {
      if (layout[y][x] === "S") start = { x, y, dist: 0 };
    }
  }

  // Flood fill to find distances to start
  const distances = { [`${start.x},${start.y}`]: start };
  const queue = new Queue<Node>([start]);

  while (!queue.isEmpty) {
    const { x, y, dist } = queue.dequeue();
    for (const [dx, dy] of DIR) {
      const [nx, ny] = [x + dx, y + dy];
      // Ignore if out of bounds, wall, or already visited
      if (
        layout[ny]?.[nx] === undefined ||
        layout[ny][nx] === "#" ||
        distances[`${nx},${ny}`] !== undefined
      ) {
        continue;
      }
      const node = { x: nx, y: ny, dist: dist + 1 };
      distances[`${nx},${ny}`] = node;
      queue.enqueue(node);
    }
  }

  return distances;
};

/**
 * Finds the number of shortcuts between two nodes that achieve a saving better
 * than a specified threshold, while taking less than a specified length of
 * cheating time.
 *
 * Looks at each pair of track pieces and calculates the possible saving that could be
 * achieved between the two. At best, a cheating time of X allows us to travel a distance
 * of X (manhattan distance), which means that all track pieces within X of each other
 * are potential shortcuts. All we then have to do is calculate the saving that could be
 * achieved by taking the shortcut.
 *
 * @param {Record<string, Node>} distances - The distances between the starting node and all other nodes
 * @param {number} threshold - The threshold for the saving
 * @param {number} cheatLength - The maximum length of cheating time
 * @returns {number} The number of shortcuts that achieve a saving better than the threshold
 */
const findShortcutsBetterThan = (
  distances: Record<string, Node>,
  threshold: number,
  cheatLength: number
): number => {
  let count = 0;
  const nodes = Object.values(distances);
  for (const start of nodes) {
    for (const end of nodes) {
      const mDist = manhattan(start, end);
      const saving = end.dist - start.dist - mDist;
      if (mDist <= cheatLength && saving >= threshold) count++;
    }
  }
  return count;
};

// Results
const distances = getDistances(input);
const p1 = findShortcutsBetterThan(distances, 100, 2);
const p2 = findShortcutsBetterThan(distances, 100, 20);

console.log(`Part 1: ${p1}`);
console.log(`Part 2: ${p2}`);
