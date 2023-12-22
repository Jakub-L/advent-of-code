import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { MinHeap as PriorityQueue } from "@jakub-l/aoc-lib/data-structures";

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

/** A city block within the lava caves */
type CityBlock = { x: number; y: number; heat: number; direction: Direction | null; streak: number };
/** A function that maps a city block to its priority, used for the Priority Queue */
const priorityMapper = (block: CityBlock): number => block.heat;

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
  minStreak?: number;
  maxStreak?: number;
}

/**
 * Performs Dijkstra's algorithm on the given grid, starting at the given start
 * @param {number[][]} grid - A 2D array of numbers, representing the heat of each block
 * @param {DijkstraOptions} options - Options for the algorithm
 * @param {number} options.start - The starting point of the algorithm. Defaults to [0, 0]
 * @param {number} options.end - The ending point of the algorithm. Defaults to [grid.length - 1, grid[0].length - 1]
 * @param {number} options.minStreak - The minimum number of blocks that must be traversed in the same direction. Defaults to 0
 * @param {number} options.maxStreak - The maximum number of blocks that can be traversed in the same direction. Defaults to 3
 * @returns {number} The minimum heat loss to get from the start to the end
 */
export const dijkstra = (grid: number[][], options: DijkstraOptions = {}): number => {
  const { start = [0, 0], end = [grid.length - 1, grid[0].length - 1], minStreak = 0, maxStreak = 3 } = options;
  const visited = new Set();
  const [ys, xs] = start;
  const [yt, xt] = end;
  const queue: PriorityQueue<CityBlock> = new PriorityQueue<CityBlock>(
    [{ x: ys, y: xs, heat: 0, direction: null, streak: 0 }],
    priorityMapper
  );

  while (!queue.isEmpty) {
    const { x, y, heat, direction, streak } = queue.pop();
    if (x === xt && y === yt) return heat;
    for (let newDir of directionArray) {
      const [dx, dy] = directionDelta[newDir];
      let [xx, yy] = [x + dx, y + dy];
      let newHeat = heat + grid[yy]?.[xx] ?? 0;
      let newStreak = newDir === direction ? streak + 1 : 1;
      while (newStreak < minStreak) {
        [xx, yy] = [xx + dx, yy + dy];
        newHeat += grid[yy]?.[xx] ?? 0;
        newStreak++;
      }
      const id = `${xx},${yy},${newDir},${newStreak}`;

      const isReverse = direction !== null && newDir === directionArray[(direction + 2) % 4];
      const isStreakBad = newStreak > maxStreak;
      const isOutOfBounds = grid[yy]?.[xx] === undefined;
      const isVisited = visited.has(id);
      if (isReverse || isStreakBad || isVisited || isOutOfBounds) continue;

      visited.add(id);
      queue.add({ x: xx, y: yy, heat: newHeat, direction: newDir, streak: newStreak });
    }
  }
  return -1;
};

// INPUT PARSING
const input = readFile(__dirname + "/input.txt", ["\n", ""], x => Number(x)) as unknown[][] as number[][];

// RESULTS
console.log(`Part 1: ${dijkstra(input)}`);
console.log(`Part 2: ${dijkstra(input, { minStreak: 4, maxStreak: 10 })}`);
