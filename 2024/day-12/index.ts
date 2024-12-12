import { Queue } from "@jakub-l/aoc-lib/data-structures";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

// Constants
const DIR = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0]
];

// Input
const input: string[][] = readFile(`${__dirname}/input.txt`, ["\n", ""]) as string[][];

const sample = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`
  .split("\n")
  .map(line => line.split(""));

// Part 1
class Plot {
  public x: number;
  public y: number;
  public plant: string;
  public neighbours: Set<string> = new Set();

  constructor(x: number, y: number, plant: string) {
    this.x = x;
    this.y = y;
    this.plant = plant;
  }

  public toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}

class Region {
  public plots: Plot[] = [];

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
    return this.plots.reduce((acc, plot) => acc + 4 - plot.neighbours.size, 0);
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
              plot.neighbours.add(`${nx},${ny}`);
              neighbour.neighbours.add(`${plot.x},${plot.y}`);
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
