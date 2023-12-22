import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { MinHeap } from "@jakub-l/aoc-lib/data-structures";

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

// UTILS
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

type CityBlock = { x: number; y: number; heat: number; direction: Direction | null; streak: number };
type QueueNode = { priority: number; val: CityBlock };

const blockToNode = (block: CityBlock): QueueNode => ({ priority: block.heat, val: block });

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
  const [yt, xt] = end;
  const startNode = blockToNode({ x: start[1], y: start[0], heat: 0, direction: null, streak: 0 });
  const queue: MinHeap<CityBlock> = new MinHeap<CityBlock>([startNode]);

  while (!queue.isEmpty) {
    const { x, y, heat, direction, streak } = (queue.pop() as QueueNode).val;
    if (x === xt && y === yt) return heat;
    for (let newDir of directionArray) {
      const [dx, dy] = directionDelta[newDir];
      const [xx, yy] = [x + dx, y + dy];
      const newStreak = newDir === direction ? streak + 1 : 1;
      const id = `${xx},${yy},${newDir},${newStreak}`;

      const isReverse = direction !== null && newDir === directionArray[(direction + 2) % 4];
      const isStreakBad = newStreak > 3;
      const isOutOfBounds = grid[yy]?.[xx] === undefined;
      const isVisited = visited.has(id);
      if (isReverse || isStreakBad || isVisited || isOutOfBounds) continue;

      visited.add(id);
      queue.add(blockToNode({ x: xx, y: yy, heat: heat + grid[yy][xx], direction: newDir, streak: newStreak }));
    }
  }
  return -1;
};

console.log(dijkstra(input));
console.log("Part 1 should be: 1256");
console.log("Part 2 should be: 1382");
