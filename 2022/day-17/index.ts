/**
 * Solution to Day 17 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/17
 */
import { readInput } from '../utils';

// INPUTS
const gusts: number[] = readInput('./day-17/input.txt', '').map(char =>
  char === '>' ? 1 : -1
);
// const gusts: number[] = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`.split("").map(char =>
//   char === '>' ? 1 : -1
// );

const shapes: Point[][] = [
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]],
  [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]],
  [[0, 0], [0, 1], [0, 2], [0, 3]],
  [[0, 0], [0, 1], [1, 0], [1, 1]]
]

// UTILS
type Point = [number, number]

const getGust = (time: number) => gusts[time % gusts.length]

class Rock {
  points: Point[];

  constructor(time: number, x0: number, y0: number) {
    this.points = shapes[time % shapes.length]
    this.move(x0, y0)
  }

  /**
   * Moves a rock to a particluar location
   * @param {number} dx - X distance to move (positive left)
   * @param {number} dy - Y distance to move (positive up)
   */
  move(dx: number, dy: number) {
    this.points = this.points.map(([x, y]) => [x + dx, y + dy]) as Point[]
  }

  canMove(dx: number, dy: number, chamberWidth: number, filledSpaces: Set<string>): boolean {
    return this.points.every(([x, y]) => (x + dx) >= 0 && (x + dx) < chamberWidth && (y + dy) >= 0 && !filledSpaces.has(`${x + dx},${y + dy}`))
  }

  get topY(): number {
    return this.points.reduce((acc, [_, y]) => Math.max(acc, y), -Infinity)
  }
}

class Chamber {
  rockTicker: number = 0;
  gustTicker: number = 0;
  filledSpaces: Set<string> = new Set();
  width: number;
  spawnPos: Point;
  height: number = 0;


  constructor(width: number, spawnPos: Point) {
    this.width = width;
    this.spawnPos = spawnPos;
  }

  dropNRocks(n: number) {
    for (let i = 0; i < n; i++) {
      this.dropRock()
    }
  }

  private dropRock() {
    const [x, y] = this.spawnPos
    const rock = new Rock(this.rockTicker, x, y + this.height)
    let isMoving = true;
    this.rockTicker += 1
    while (isMoving) {
      const dx = getGust(this.gustTicker)
      this.gustTicker += 1;
      if (rock.canMove(dx, 0, this.width, this.filledSpaces)) rock.move(dx, 0)
      if (rock.canMove(0, -1, this.width, this.filledSpaces)) rock.move(0, -1)
      else isMoving = false;
    }
    rock.points.forEach(([x, y]) => this.filledSpaces.add(`${x},${y}`))
    this.height = Math.max(this.height, rock.topY + 1);
  }

}

const c = new Chamber(7, [2, 3])
c.dropNRocks(2022)
console.log(c.height)
