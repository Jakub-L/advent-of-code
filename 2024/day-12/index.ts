import { Queue } from "@jakub-l/aoc-lib/data-structures";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

// Constants
/** Vertical/horizontal neighbours */
const DIR: number[][] = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0]
];

// prettier-ignore
/** Pairs of orthogonal neighbours */
const ORTHOGONAL_PAIRS: number[][][] = [
  [[0, -1], [1, 0]], // Up and right
  [[1, 0], [0, 1]],  // Right and down
  [[0, 1], [-1, 0]], // Down and left
  [[-1, 0], [0, -1]] // Left and up
];

// Input
const input: string[][] = readFile(`${__dirname}/input.txt`, ["\n", ""]) as string[][];

// Part 1 & 2
/** A plot in the garden, growing a single plant */
class Plot {
  /** Neighbours of the plot */
  public neighbours: Set<string> = new Set();

  /**
   * Create a new plot.
   * @param {number} x - The x-coordinate (column)
   * @param {number} y - The y-coordinate (row)
   * @param {string} plant - The plant growing in the plot
   */
  constructor(public x: number, public y: number, public plant: string) {}

  /**
   * Calculate the number of corners the plot has.
   *
   * The number of corners is equivalent to the number of straight edges in the region, since
   * each corner has two edges that meet at it, and each edge is capped by two corners.
   *
   * The number of corners is calculated by checking each orthogonal pair of neighbours. If both
   * orthogonal neighbours are different from the current plot, then that direction has an
   * external corner. For example:
   *    ...
   *    ##.
   *    ...
   * Both the Up-Right and Right-Down pairs are the different from the current plot (dots), so
   * they are corners. The Down-Left pair and the Left-Up pair have at least one hash, so they
   * are not corners. This plot has 2 corners.
   *
   * If both orthogonal neighbours match the current plot and the diagonal neighbour between them
   * does not, then that direction is an internal corner. For example:
   *   ...
   *   ###
   *   ##.
   * The Up-Right and Left-Up pair have at least one hash, but not two hashes, so they are not
   * corners. The Right-Down pair has two hashes, and its diagonal is a dot (bottom-right corner),
   * so it is an internal corner. The Down-Left pair has two hashes, but its diagonal is also a
   * hash, so it is not a corner. This plot has 1 corner.
   *
   * @param {string[][]} layout - The layout of the garden, represented as a 2D array of plants
   * @returns {number} The number of corners the plot has.
   */
  public cornerCount(layout: string[][]): number {
    let count = 0;
    for (const [[dx1, dy1], [dx2, dy2]] of ORTHOGONAL_PAIRS) {
      const point1 = layout[this.y + dy1]?.[this.x + dx1];
      const point2 = layout[this.y + dy2]?.[this.x + dx2];
      const diagonal = layout[this.y + dy1 + dy2]?.[this.x + dx1 + dx2];
      if (point1 !== this.plant && point2 !== this.plant) count++;
      else if (point1 === this.plant && point2 === this.plant && diagonal !== this.plant) count++;
    }
    return count;
  }
}

/** A contiguous region in a garden, consisting of a single plant type */
class Region {
  /** Plots in the region */
  public plots: Plot[] = [];

  /**
   * Calculate the bulk price of fencing the region
   * @param {string[][]} layout - The layout of the garden, represented as a 2D array of plants
   * @returns {number} The price of fencing the region, defined as the product of the area and
   *      the number of straight edges enclosing the region
   */
  public bulkPrice(layout: string[][]): number {
    return this._area * sum(this.plots.map(plot => plot.cornerCount(layout)));
  }

  /** The price of fencing region, defined as the product of the area and perimeter */
  get price(): number {
    return this._area * this._perimeter;
  }

  /** Area of the region */
  get _area(): number {
    return this.plots.length;
  }

  /** Perimeter of the region */
  private get _perimeter(): number {
    return this.plots.reduce((acc, plot) => acc + 4 - plot.neighbours.size, 0);
  }
}

/** A garden, consisting of multiple regions */
class Garden {
  /** Regions in the garden */
  public regions: Region[] = [];

  /**
   * Create a new garden.
   *
   * Uses a breadth-first search to find all contiguous regions in the garden.
   */
  constructor(layout: string[][]) {
    const assigned = new Set<string>();
    for (let y = 0; y < layout.length; y++) {
      for (let x = 0; x < layout[y].length; x++) {
        // If we're encountering a point we've not already seen,
        // start a new region and queue for bfs-filling.
        if (assigned.has(`${x},${y}`)) continue;
        const region = new Region();
        const queue = new Queue<Plot>([new Plot(x, y, layout[y][x])]);
        this.regions.push(region);

        while (!queue.isEmpty) {
          const plot = queue.dequeue();
          if (assigned.has(`${plot.x},${plot.y}`)) continue;
          assigned.add(`${plot.x},${plot.y}`);
          region.plots.push(plot);

          // Check all neighbours. If they are of the same plant, add them
          // to the region, and the queue, and create a connection between
          // the current plot and the neighbour.
          for (const [dx, dy] of DIR) {
            const nx = plot.x + dx;
            const ny = plot.y + dy;
            if (layout[ny]?.[nx] === plot.plant) {
              const neighbour = new Plot(nx, ny, layout[ny][nx]);
              plot.neighbours.add(`${neighbour.x},${neighbour.y}`);
              neighbour.neighbours.add(`${plot.x},${plot.y}`);
              queue.enqueue(neighbour);
            }
          }
        }
      }
    }
  }
}

// Results
const garden = new Garden(input);

console.log(`Part 1: ${sum(garden.regions.map(r => r.price))}`);
console.log(`Part 2: ${sum(garden.regions.map(r => r.bulkPrice(input)))}`);
