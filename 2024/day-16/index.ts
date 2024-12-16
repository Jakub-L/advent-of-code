import { MinHeap } from "@jakub-l/aoc-lib/data-structures";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// Types & enums
enum Dir {
  N,
  S,
  E,
  W
}
type Node = { x: number; y: number; dist: number; dir: Dir; path: string[] };

// Constants
const POSSIBLE_DIRS = {
  [Dir.N]: [Dir.N, Dir.E, Dir.W],
  [Dir.W]: [Dir.W, Dir.N, Dir.S],
  [Dir.S]: [Dir.S, Dir.W, Dir.E],
  [Dir.E]: [Dir.E, Dir.S, Dir.N]
};
const MOVES = {
  [Dir.N]: [0, -1],
  [Dir.S]: [0, 1],
  [Dir.E]: [1, 0],
  [Dir.W]: [-1, 0]
};

// Input
const input: string[][] = readFile(`${__dirname}/input.txt`, ["\n", ""]) as string[][];

const sample = `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`
  .split("\n")
  .map(r => r.split(""));

// Part 1
const dijkstra = (layout: string[][]) => {
  let start: Node = { x: -1, y: -1, dist: 0, dir: Dir.E, path: [] };
  let end: { x: number; y: number } = { x: -1, y: -1 };
  let minDist = Infinity;
  const seats = new Set<string>();

  for (let y = 0; y < layout.length; y++) {
    for (let x = 0; x < layout[y].length; x++) {
      if (layout[y][x] === "S") start = { ...start, x, y };
      if (layout[y][x] === "E") end = { x, y };
    }
  }

  const queue: MinHeap<Node> = new MinHeap([start], e => e.dist);
  const visited: Map<string, number> = new Map();

  while (!queue.isEmpty) {
    console.log(queue.size);
    const { x, y, dist, dir, path } = queue.pop()!;
    if (dist > minDist) continue;
    if (x === end.x && y === end.y) {
      if (dist < minDist) {
        minDist = dist;
        seats.clear();
      }
      if (dist === minDist) {
        path.forEach(p => seats.add(p));
      }
      continue;
    }

    for (const newDir of POSSIBLE_DIRS[dir]) {
      const [dx, dy] = MOVES[newDir];
      const [xx, yy] = [x + dx, y + dy];
      const newDist = dist + 1 + (newDir === dir ? 0 : 1000);
      if (layout[yy]?.[xx] === "#") continue;
      if (visited.has(`${xx},${yy},${newDir}`) && visited.get(`${xx},${yy},${newDir}`)! < newDist) continue;
      visited.set(`${xx},${yy},${newDir}`, newDist);
      queue.add({ x: xx, y: yy, dist: newDist, dir: newDir, path: [...path, `${xx},${yy}`] });
    }
  }
  seats.add(`${start.x},${start.y}`);
  return { dist: minDist, seats };
};

// Part 2

// Results
const { dist, seats } = dijkstra(input);
console.log(dist, seats.size);
