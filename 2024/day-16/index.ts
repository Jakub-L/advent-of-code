import { MinHeap } from "@jakub-l/aoc-lib/data-structures";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// Types & enums
// prettier-ignore
/** Travel directions, representing North, South, East and West */
enum Dir { N, S, E, W }
/** A racing reindeer. A node in the graph of the maze */
type Reindeer = {
  /** The x-coordinate of the reindeer */
  x: number;
  /** The y-coordinate of the reindeer */
  y: number;
  /** The current distance travelled */
  dist: number;
  /** The direction the reindeer is facing */
  dir: Dir;
  /** The path the reindeer has taken so far */
  path: string[];
};

// Constants
/**
 * The possible directions a reindeer can move if facing in a direciton.
 * Reindeer can move straight ahead or turn 90 degrees clockwise or anticlockwise
 */
const POSSIBLE_DIRS: Record<Dir, Dir[]> = {
  [Dir.N]: [Dir.N, Dir.E, Dir.W],
  [Dir.W]: [Dir.W, Dir.N, Dir.S],
  [Dir.S]: [Dir.S, Dir.W, Dir.E],
  [Dir.E]: [Dir.E, Dir.S, Dir.N]
};

/** The conversion from movement direction to a grid delta */
const MOVES: Record<Dir, [number, number]> = {
  [Dir.N]: [0, -1],
  [Dir.S]: [0, 1],
  [Dir.E]: [1, 0],
  [Dir.W]: [-1, 0]
};

// Input
const input: string[][] = readFile(`${__dirname}/input.txt`, ["\n", ""]) as string[][];

// Part 1 & 2
/**
 * Performs the reindeer race, finding the minimum score of reaching the exit and
 * the seats that could be taken along the fastest path. Uses the Dijkstra algorithm.
 *
 * @param {string[][]} layout - The layout of the racing maze
 * @returns {{score: number, seats: number}} The score and best seat count for the maze.
 */
const raceReindeer = (layout: string[][]): { score: number; seats: number } => {
  let start: Reindeer = { x: -1, y: -1, dist: 0, dir: Dir.E, path: [] };
  let end: { x: number; y: number } = { x: -1, y: -1 };
  for (let y = 0; y < layout.length; y++) {
    for (let x = 0; x < layout[y].length; x++) {
      if (layout[y][x] === "S") start = { ...start, x, y };
      if (layout[y][x] === "E") end = { x, y };
    }
  }

  let score = Infinity;
  let seats = new Set<string>();
  const queue: MinHeap<Reindeer> = new MinHeap([start], e => e.dist);
  const visited: Map<string, number> = new Map();

  while (!queue.isEmpty) {
    const { x, y, dist, dir, path } = queue.pop()!;

    // If our current distance exceeds the score, we aren't on the shortest path
    if (dist > score) continue;

    // If we've reached the end, check if we reached it by the best distance so far.
    // If yes, add our current path to the possible seats. If we've got a new best
    // distance, our current path is the only possible seats so far.
    if (x === end.x && y === end.y) {
      if (dist < score) {
        score = dist;
        seats.clear();
      }
      if (dist === score) path.forEach(p => seats.add(p));
      continue;
    }

    // Otherwise, we need to check every possible direction we could move.
    for (const newDir of POSSIBLE_DIRS[dir]) {
      const [dx, dy] = MOVES[newDir];
      const [xx, yy] = [x + dx, y + dy];
      // Our score increases by 1 if we continue in the current direction, or by 1001
      // (1000 for rotation, 1 for step in new direction) if we needed to turn.
      const newDist = dist + (newDir === dir ? 1 : 1001);
      const id = `${xx}, ${yy}, ${newDir}`;
      // If we hit a wall, or we have already visited this location from this direction
      // and had a better score, we can skip checking that point.
      if (layout[yy]?.[xx] === "#" || (visited.get(id) || Infinity) < newDist) continue;
      visited.set(id, newDist);
      queue.add({ x: xx, y: yy, dist: newDist, dir: newDir, path: [...path, `${xx},${yy}`] });
    }
  }
  // Add 1 to possible seats to account for the starting location
  return { score, seats: seats.size + 1 };
};

// Results
const { score, seats } = raceReindeer(input);
console.log(`Part 1: ${score}`);
console.log(`Part 2: ${seats}`);
