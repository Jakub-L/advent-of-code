import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// const input = `2413432311323
// 3215453535623
// 3255245654254
// 3446585845452
// 4546657867536
// 1438598798454
// 4457876987766
// 3637877979653
// 4654967986887
// 4564679986453
// 1224686865563
// 2546548887735
// 4322674655533`
//   .split("\n")
//   .map(line => line.split("").map(Number));

const input = readFile(__dirname + "/input.txt", ["\n", ""], x => Number(x)) as unknown[][] as number[][];

/**
 * Enumeration of directions: Up, Right, Down, Left. This arrangement means that
 * for i-th direction, [(i + 2) % 4]-th direction is the reverse direction
 */
enum Direction {
  Up,
  Right,
  Down,
  Left
}

const directionArray: Direction[] = [Direction.Up, Direction.Right, Direction.Down, Direction.Left];
const directionDelta: Record<Direction, [number, number]> = {
  [Direction.Up]: [-1, 0],
  [Direction.Right]: [0, 1],
  [Direction.Down]: [1, 0],
  [Direction.Left]: [0, -1]
};

interface DijkstraOptions {
  start?: [number, number];
  end?: [number, number];
}

export const dijkstra = (grid: number[][], options: DijkstraOptions = {}): number => {
  const { start = [0, 0], end = [grid.length - 1, grid[0].length - 1] } = options;
  const visited = new Set();
  const [y0, x0] = start;
  const [yt, xt] = end;
  const queue: { x: number; y: number; heat: number; history: Direction[] }[] = [
    { x: x0, y: y0, heat: 0, history: [] }
  ];

  while (queue.length) {
    const { x, y, heat, history } = queue.shift()!;
    // If we made it to the end, return distance to it
    if (x === xt && y === yt) return heat;
    // Otherwise, check every neighbour
    const neighbours: Direction[] = getNeighbours(history.slice(-3));
    for (let direction of neighbours) {
      const [dx, dy] = directionDelta[direction];
      const [xx, yy] = [x + dx, y + dy];
      const id = `${xx},${yy},${direction},[${history.slice(-3).join(",")}]`;
      // If point is outside grid bounds or has been visited, skip it
      if (grid[yy]?.[xx] === undefined || visited.has(id)) continue;
      // Otherwise mark the point as visited and add it to the queue of vertices to check
      visited.add(id);
      queue.push({ x: xx, y: yy, heat: heat + grid[yy][xx], history: [...history, direction] });
    }
    // Sort the queue to find the shortest-distance vertex to inspect next
    queue.sort((a, b) => a.heat - b.heat);
  }
  return -1;
};

const getNeighbours = (directionHistory: Direction[]): Direction[] => {
  // Can't go back
  let allowedDirections = directionArray.filter(dir => (dir + 2) % 4 !== dir);
  if (directionHistory.length >= 3 && directionHistory.every(dir => dir === directionHistory[0])) {
    allowedDirections = allowedDirections.filter(dir => dir !== directionHistory[0]);
  }
  return allowedDirections;
};

console.log(dijkstra(input));
console.log("Part 1 should be: 1256");
console.log("Part 2 should be: 1382");
