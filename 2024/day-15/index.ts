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
//   `##########
// #..O..O.O#
// #......O.#
// #.OO..O.O#
// #..O@..O.#
// #O#..O...#
// #O..O..O.#
// #.OO.O.OO#
// #....O...#
// ##########

// <vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
// vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
// ><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
// <<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
// ^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
// ^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
// >^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
// <><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
// ^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
// v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`.split("\n\n")
// );
// const [layout, instructions] = parseInput(
//   `##########
// #..O..O.O#
// #......O.#
// #.OO..O.O#
// #..O@..O.#
// #O#..O...#
// #O..O..O.#
// #.OO.O.OO#
// #....O...#
// ##########

// <vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
// vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
// ><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
// <<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
// ^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
// ^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
// >^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
// <><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
// ^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
// v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`.split("\n\n")
// );

// Part 1
class Warehouse {
  private _width: number;
  private _height: number;
  private _robot: Coord = { x: -1, y: -1 };
  private _walls: Set<string> = new Set();
  private _boxes: Map<string, Coord> = new Map();

  constructor(layout: WarehouseLayout) {
    this._height = layout.length;
    this._width = layout[0].length;
    for (let y = 0; y < layout.length; y++) {
      for (let x = 0; x < layout[y].length; x++) {
        const cell = layout[y][x];
        if (cell === "#") this._walls.add(`${x},${y}`);
        else if (cell === "O") this._boxes.set(`${x},${y}`, { x, y });
        else if (cell === "@") this._robot = { x, y };
      }
    }
  }

  private _parseInstruction(instruction: string): void {
    if (DIR[instruction] === undefined) console.log(instruction);
    const { dx, dy } = DIR[instruction];
    const [xx, yy] = [this._robot.x + dx, this._robot.y + dy];
    let [bx, by] = [xx, yy];
    if (this._walls.has(`${xx},${yy}`)) return;
    while (this._boxes.has(`${bx},${by}`)) {
      bx += dx;
      by += dy;
      if (this._walls.has(`${bx},${by}`)) return;
    }
    this._robot = { x: xx, y: yy };
    while (bx !== xx || by !== yy) {
      const [bx2, by2] = [bx, by];
      bx -= dx;
      by -= dy;
      this._boxes.delete(`${bx},${by}`);
      this._boxes.set(`${bx2},${by2}`, { x: bx2, y: by2 });
    }
  }

  public run(instructions: Instructions): void {
    for (const instruction of instructions) this._parseInstruction(instruction);
  }

  public toString(): string {
    let str = "";
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        const pos = `${x},${y}`;
        if (this._robot.x === x && this._robot.y === y) str += "@";
        else if (this._walls.has(pos)) str += "#";
        else if (this._boxes.has(pos)) str += "O";
        else str += ".";
      }
      str += "\n";
    }
    return str;
  }

  get gps(): number[] {
    return Array.from(this._boxes.values()).map(({ x, y }) => x + 100 * y);
  }
}

// Results
console.time("Create");
const warehouse = new Warehouse(layout);
console.timeEnd("Create");
console.time("Run");
warehouse.run(instructions);
console.timeEnd("Run");
console.time("GPS");
console.log(sum(warehouse.gps));
console.timeEnd("GPS");
