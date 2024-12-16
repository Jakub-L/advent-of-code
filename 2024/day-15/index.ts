import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

// Constants
const DIR: Record<string, { dx: number; dy: number }> = {
  "^": { dx: 0, dy: -1 },
  v: { dx: 0, dy: 1 },
  "<": { dx: -1, dy: 0 },
  ">": { dx: 1, dy: 0 }
};

// Types
type WarehouseLayout = string[][];
type Instructions = string[];
type Coord = { x: number; y: number };

// Input
const parseInput = (input: string[]): [WarehouseLayout, Instructions] => {
  const [rawLayout, rawInstructions] = input;
  return [
    rawLayout.split("\n").map(row => row.split("")),
    rawInstructions.split("").filter(i => i !== "\n")
  ];
};

const [layout, instructions] = parseInput(readFile(`${__dirname}/input.txt`, ["\n\n"]));

// const [layout, instructions] = parseInput(
//   `#######
// #...#.#
// #.....#
// #..OO@#
// #..O..#
// #.....#
// #######

// <vv<<^^<<^^`.split("\n\n")
// );

// Utils
const swap2d = (arr: WarehouseLayout, p1: Coord, p2: Coord): void => {
  const temp = arr[p1.y][p1.x];
  arr[p1.y][p1.x] = arr[p2.y][p2.x];
  arr[p2.y][p2.x] = temp;
};

// Part 1
class Warehouse {
  private _layout: WarehouseLayout = [];
  private _robot: Coord = { x: -1, y: -1 };

  constructor(layout: WarehouseLayout, isDoubleWidth: boolean) {
    for (let y = 0; y < layout.length; y++) {
      const row = [];
      for (let x = 0; x < layout[y].length; x++) {
        const char = layout[y][x];
        if (char === "@") {
          this._robot = { x: isDoubleWidth ? 2 * x : x, y };
          row.push("@", ...(isDoubleWidth ? ["."] : []));
        } else if (char === "O" && isDoubleWidth) row.push("[", "]");
        else if (char === "O") row.push("O");
        else if (char === "#") row.push("#", ...(isDoubleWidth ? ["#"] : []));
        else row.push(".", ...(isDoubleWidth ? ["."] : []));
      }
      this._layout.push(row);
    }
  }

  private _canMove(x: number, y: number, dx: number, dy: number): boolean {
    const [xx, yy] = [x + dx, y + dy];
    const char = this._layout[yy][xx];
    if (char === "#") return false;
    else if (char === ".") return true;
    else if (char === "O") return this._canMove(xx, yy, dx, dy);
    else if (dx === 0) {
      return this._canMove(xx, yy, dx, dy) && this._canMove(xx + (char === "[" ? 1 : -1), yy, 0, 1);
    } else {
      return this._canMove(xx, yy + (char === "[" ? 1 : -1), 1, 0);
    }
  }

  private _move(x: number, y: number, dx: number, dy: number): void {
    const [xx, yy] = [x + dx, y + dy];
    const char = this._layout[yy][xx];
    if (char === "#") return;
    else if (char === ".") swap2d(this._layout, { x, y }, { x: xx, y: yy });
    else if (char === "O") {
      this._move(xx, yy, dx, dy);
      swap2d(this._layout, { x, y }, { x: xx, y: yy });
    } else if (dx === 0) {
      return;
    } else {
      return;
    }
  }

  public _parseInstruction(instruction: string): void {
    const { dx, dy } = DIR[instruction];
    const { x, y } = this._robot;
    if (this._canMove(x, y, dx, dy)) {
      this._move(x, y, dx, dy);
      this._robot = { x: x + dx, y: y + dy };
    }
  }

  public run(instructions: Instructions): void {
    for (const instruction of instructions) this._parseInstruction(instruction);
  }
  public toString(): string {
    return this._layout.map(row => row.join("")).join("\n");
  }

  get gps(): number[] {
    const gps = [];
    for (let y = 0; y < this._layout.length; y++) {
      for (let x = 0; x < this._layout[y].length; x++) {
        if (this._layout[y][x] === "O") gps.push(x + 100 * y);
      }
    }
    return gps;
  }
}

// Results
const warehouse = new Warehouse(layout, false);
warehouse.run(instructions);
console.log(sum(warehouse.gps));
// console.log(warehouse.toString());
// console.log("\n\n");
// warehouse._parseInstruction("<");
// console.log(warehouse.toString());
