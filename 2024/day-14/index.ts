import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { prod } from "@jakub-l/aoc-lib/math";

// Constants

// Types
type Coords = { x: number; y: number };
type Robot = { pos: Coords; vel: Coords };

// Input
const sample = `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`.split("\n");

const input: string[] = readFile(`${__dirname}/input.txt`) as string[];

// Part 1 & 2
class BathroomArea {
  private _width: number;
  private _height: number;
  private _robots: Robot[] = [];
  private _robotLookup: Record<string, number> = {};

  constructor(robotDefs: string[], width: number, height: number) {
    this._width = width;
    this._height = height;
    for (const def of robotDefs) {
      const [x, y, vx, vy] = def.match(/[0-9-]+/g)!.map(Number);
      this._robots.push({ pos: { x, y }, vel: { x: vx, y: vy } });
    }
    this._robotLookup = this._robots.reduce((acc, robot) => {
      const id = `${robot.pos.x},${robot.pos.y}`;
      if (!acc[id]) acc[id] = 1;
      else acc[id]++;
      return acc;
    }, {} as Record<string, number>);
  }

  private _treePresent(x: number, y: number): boolean {
    for (let dy = 1; dy < 4; dy++) {
      for (let dx = -1; dx <= dy; dx++) {
        if (!this._robotLookup[`${x + dx},${y + dy}`]) return false;
      }
    }
    return true;
  }

  public step(seconds: number = 1): void {
    this._robots.forEach(robot => {
      robot.pos.x = (robot.pos.x + seconds * (robot.vel.x + this._width)) % this._width;
      robot.pos.y = (robot.pos.y + seconds * (robot.vel.y + this._height)) % this._height;
    });
    this._robotLookup = this._robots.reduce((acc, robot) => {
      const id = `${robot.pos.x},${robot.pos.y}`;
      if (!acc[id]) acc[id] = 1;
      else acc[id]++;
      return acc;
    }, {} as Record<string, number>);
  }

  public findTree(): void {
    let seconds = 0;
    while (seconds < 10_000) {
      this.step();
      seconds++;
      for (const robot of this._robots) {
        if (this._treePresent(robot.pos.x, robot.pos.y)) {
          console.log("Tree found at", robot.pos, "after", seconds, "seconds");
          console.log(this.toString());
          return;
        }
      }
    }
  }

  public toString(): string {
    let str = "";

    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        if (this._robotLookup[`${x},${y}`]) {
          str += this._robotLookup[`${x},${y}`];
        } else {
          str += ".";
        }
      }
      str += "\n";
    }
    return str;
  }

  get safetyFactor(): number {
    const robotLookup = this._robots.reduce((acc, robot) => {
      const id = `${robot.pos.x},${robot.pos.y}`;
      if (!acc[id]) acc[id] = 1;
      else acc[id]++;
      return acc;
    }, {} as Record<string, number>);

    const quadrantCounts = [0, 0, 0, 0];
    const halfWidth = Math.floor(this._width / 2);
    const halfHeight = Math.floor(this._height / 2);
    console.log(halfHeight, halfWidth);
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        const val = robotLookup[`${x},${y}`] || 0;

        if (x < halfWidth && y < halfHeight) quadrantCounts[0] += val;
        else if (x > halfWidth && y < halfHeight) quadrantCounts[1] += val;
        else if (x < halfWidth && y > halfHeight) quadrantCounts[2] += val;
        else if (x > halfWidth && y > halfHeight) quadrantCounts[3] += val;
      }
    }
    console.log(quadrantCounts);

    return prod(quadrantCounts);
  }
}

// Results
const area = new BathroomArea(input, 101, 103);
area.findTree();
// area.step(100);
// console.log(area.toString());
// console.log(area.safetyFactor);
