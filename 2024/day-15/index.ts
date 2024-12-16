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

const [sampleLayout, sampleInstructions] = parseInput(
  `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`.split("\n\n")
);

// Part 1
class Warehouse {
  public _layout: WarehouseLayout = [];
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
      if (char === "[") return this._canMove(xx, yy, dx, dy) && this._canMove(xx - 1, yy, dx, dy);
      else if (char === "]")
        return this._canMove(xx, yy, dx, dy) && this._canMove(xx + 1, yy, dx, dy);
    } else if (char === "]") {
      return this._canMove(xx, yy - 1, dx, dy);
    } else if (char === "[") {
      return this._canMove(xx, yy + 1, dx, dy);
    }
    return false;
  }

  private _move(x: number, y: number, dx: number, dy: number): void {
    const [xx, yy] = [x + dx, y + dy];
    const char = this._layout[yy][xx];
    if (char === "#") return;
    else if (char === ".") {
      [this._layout[y][x], this._layout[yy][xx]] = [this._layout[yy][xx], this._layout[y][x]];
    } else if (char === "O") {
      this._move(xx, yy, dx, dy);
      [this._layout[y][x], this._layout[yy][xx]] = [this._layout[yy][xx], this._layout[y][x]];
    } else if (dx !== 0) {
      this._move(xx, yy, dx, dy);
      [this._layout[y][x], this._layout[yy][xx]] = [this._layout[yy][xx], this._layout[y][x]];
    } else {
      this._move(xx, yy, dx, dy);
      this._move(xx + (char === "[" ? 1 : -1), yy, dx, dy);
      [this._layout[y][x], this._layout[yy][xx]] = [this._layout[yy][xx], this._layout[y][x]];
    }
  }

  public _parseInstruction(instruction: string): void {
    const { dx, dy } = DIR[instruction];
    const { x, y } = this._robot;
    if (this._canMove(x, y, dx, dy)) {
      this._move(x, y, dx, dy);
      this._robot = { x: x + dx, y: y + dy };
    }
    console.log(this.toString());
    console.log("\n\n");
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
        if (this._layout[y][x] === "O" || this._layout[y][x] === "[") gps.push(x + 100 * y);
      }
    }
    return gps;
  }
}

// // Results
// const part1 = new Warehouse(layout, false);
// part1.run(instructions);
// console.log(`Part 1 still correct? > ${sum(part1.gps) === 1479679}`);

const warehouse = new Warehouse(sampleLayout, true);

warehouse._layout = `####################
##[].......[].[][]##
##[]...........[].##
##[]........[][][]##
##[]......[]....[]##
##..##......[]....##
##..[]............##
##..@......[].[][]##
##......[][]..[]..##
####################`.split("\n").map(row => row.split(""));

// warehouse.run(instructions);
// console.log(warehouse.toString());
// console.log("\n\n");
// warehouse.run(sampleInstructions.slice(0, 2));
console.log(sum(warehouse.gps));
