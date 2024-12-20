import { Counter } from "@jakub-l/aoc-lib/collections";
import { MinHeap, Queue } from "@jakub-l/aoc-lib/data-structures";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// Types
type Coord = { x: number; y: number };
type Node = { x: number; y: number; dist: number };

// Constants
// prettier-ignore
const DIR: [number, number][] = [[0, 1], [1, 0], [0, -1], [-1, 0]];

// Inputs
const sample = `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`
  .split("\n")
  .map(row => row.split(""));

const input: string[][] = readFile(`${__dirname}/input.txt`, ["\n", ""]) as string[][];

// Part 1
const manhattan = (a: Coord, b: Coord): number => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const getDistances = (layout: string[][]): Record<string, Node> => {
  let start: Node = { x: -1, y: -1, dist: Infinity };

  for (let y = 0; y < layout.length; y++) {
    for (let x = 0; x < layout[y].length; x++) {
      if (layout[y][x] === "S") start = { x, y, dist: 0 };
    }
  }

  const distances = { [`${start.x},${start.y}`]: start };
  const queue = new Queue<Node>([start]);

  while (!queue.isEmpty) {
    const { x, y, dist } = queue.dequeue();
    for (const [dx, dy] of DIR) {
      const [nx, ny] = [x + dx, y + dy];
      if (
        layout[ny]?.[nx] === undefined ||
        layout[ny][nx] === "#" ||
        distances[`${nx},${ny}`] !== undefined
      ) {
        continue;
      }
      distances[`${nx},${ny}`] = { x: nx, y: ny, dist: dist + 1 };
      queue.enqueue({ x: nx, y: ny, dist: dist + 1 });
    }
  }

  return distances;
};

const findShortcutsBetterThan = (
  distances: Record<string, Node>,
  threshold: number,
  cheatLength: number
): number => {
  let count = 0;
  const nodes = Object.values(distances);
  for (const start of nodes) {
    for (const end of nodes) {
      const saving = end.dist - start.dist - manhattan(start, end);
      if (start.x === end.x && start.y === end.y) continue;
      if (manhattan(start, end) <= cheatLength && saving >= threshold) count++;
    }
  }
  return count;
};

// Results
const distances = getDistances(input);
const p1 = findShortcutsBetterThan(distances, 100, 2);
const p2 = findShortcutsBetterThan(distances, 100, 20);
console.log(p2);
