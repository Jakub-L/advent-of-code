import { Queue } from "@jakub-l/aoc-lib/data-structures";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

// Constants
const DIR: number[][] = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0]
];

const ORTHOGONAL_PAIRS: number[][][] = [
  [
    [0, -1],
    [1, 0]
  ], // Up and right
  [
    [1, 0],
    [0, 1]
  ], // Right and down
  [
    [0, 1],
    [-1, 0]
  ], // Down and left
  [
    [-1, 0],
    [0, -1]
  ] // Left and up
];

// Input
const input: string[][] = readFile(`${__dirname}/input.txt`, ["\n", ""]) as string[][];

const sample = `EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`
  .split("\n")
  .map(line => line.split(""));

// Part 1
class Plot {
  public x: number;
  public y: number;
  public plant: string;
  public neighbours: Record<string, Plot> = {};

  constructor(x: number, y: number, plant: string) {
    this.x = x;
    this.y = y;
    this.plant = plant;
  }

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

  public toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}

class Region {
  public plots: Plot[] = [];

  public bulkPrice(layout: string[][]): number {
    return this.area * sum(this.plots.map(plot => plot.cornerCount(layout)));
  }
  public toString(): string {
    return `${this.plots[0].plant}: ${this.plots.map(plot => plot.toString()).join(", ")}`;
  }

  get plant(): string {
    return this.plots[0].plant;
  }

  get area(): number {
    return this.plots.length;
  }

  get perimeter(): number {
    return this.plots.reduce((acc, plot) => acc + 4 - Object.keys(plot.neighbours).length, 0);
  }

  get price(): number {
    return this.area * this.perimeter;
  }
}

class Garden {
  public regions: Region[] = [];

  constructor(layout: string[][]) {
    const assigned = new Set<string>();
    for (let y = 0; y < layout.length; y++) {
      for (let x = 0; x < layout[y].length; x++) {
        if (assigned.has(`${x},${y}`)) continue;
        const region = new Region();
        const queue = new Queue<Plot>([new Plot(x, y, layout[y][x])]);
        this.regions.push(region);
        while (!queue.isEmpty) {
          const plot = queue.dequeue();
          if (assigned.has(`${plot.x},${plot.y}`)) continue;
          assigned.add(`${plot.x},${plot.y}`);
          region.plots.push(plot);
          for (const [dx, dy] of DIR) {
            const nx = plot.x + dx;
            const ny = plot.y + dy;
            if (layout[ny]?.[nx] === plot.plant) {
              const neighbour = new Plot(nx, ny, layout[ny][nx]);
              plot.neighbours[`${nx},${ny}`] = neighbour;
              neighbour.neighbours[`${plot.x},${plot.y}`] = plot;
              queue.enqueue(neighbour);
            }
          }
        }
      }
    }
  }
}

const garden = new Garden(input);
console.log(sum(garden.regions.map(r => r.price)));
console.log(sum(garden.regions.map(r => r.bulkPrice(input))));
