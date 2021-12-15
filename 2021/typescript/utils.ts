import { readFileSync } from 'fs';

/**
 * Processes an input file into an array of strings
 * @param {string} path - Filepath of the input file to process
 * @param {string} [delimiter=\n] - Delimiter used to split file into array
 * @returns {Array.<string>} Input file split by delimiter
 */
export const readInput = (path: string, delimiter = '\n'): Array<string> => {
  return readFileSync(path, 'utf-8').split(delimiter);
};

/**
 * Searches through a grid of numbers using Dijkstra's algorithm to find the shortest path between
 * the start and end. Assumes only vertical and horizontal movement is allowed.
 * @param {number[][]} grid - 2D array of numbers representing the cost to enter a grid point
 * @param {number[]} [start=[0,0]] - The starting coordinates of the search [y, x]
 * @param {number[]} [end=[grid.length - 1, grid[0].length - 1]] - The end coordinates of the search [y, x]
 * @returns {number} The distance from start to end, or -1 if no path could be found
 */
export const gridShortestPath = (
  grid: number[][],
  start: number[] = [0, 0],
  end: number[] = [grid.length - 1, grid[0].length - 1]
): number => {
  // prettier-ignore
  const neighbours = [[-1, 0], [0, -1], [0, 1], [1, 0]];
  const visited = new Set();
  const [y0, x0] = start;
  const [yt, xt] = end;
  const queue = [{ x: x0, y: y0, dist: 0 }];

  while (queue.length) {
    const { x = 0, y = 0, dist = 0 } = queue.shift() || {};
    // If we made it to the end, return distance to it
    if (x === xt && y === yt) return dist;
    // Otherwise, check every neighbour
    for (let [dx, dy] of neighbours) {
      const [xx, yy] = [x + dx, y + dy];
      // If point is outside grid bounds or has been visited, skip it
      if (grid[yy]?.[xx] === undefined || visited.has(`${xx},${yy}`)) continue;
      // Otherwise mark the point as visited and add it to the queue of vertices to check
      visited.add(`${xx},${yy}`);
      queue.push({ x: xx, y: yy, dist: dist + grid[yy][xx] });
    }
    // Sort the queue to find the shortest-distance vertex to inspect next
    queue.sort((a, b) => a.dist - b.dist);
  }
  return -1;
};
