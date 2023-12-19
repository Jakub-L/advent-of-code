const input = `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`
  .split("\n")
  .map(line => line.split(" "));

type Direction = "U" | "D" | "L" | "R";
type Instruction = { dir: Direction; dist: number; color: string };

const dirDelta = {
  U: [0, 1],
  D: [0, -1],
  L: [-1, 0],
  R: [1, 0]
};

const parseInstructionString = (rawInstruction: string[]): Instruction => {
  const [dir, dist, color] = rawInstruction;
  return { dir: dir as Direction, dist: Number(dist), color };
};

class Lagoon {
  private _points: number[][] = [];
  private _area: number = 0;

  dig(instructions: Instruction[]) {
    this._area = 0;
    this._points = [];
    let [x, y] = [0, 0];
    for (const { dir, dist } of instructions) {
      const [dx, dy] = dirDelta[dir].map(d => d * dist);
      [x, y] = [x + dx, y + dy];
      this._points.push([x, y]);
    }
  }

  get area() {
    if (this._area > 0) return this._area;
    const len = this._points.length;
    let sum = 0;
    for (let i = 0; i < len; i++) {
      const [x1, y1] = this._points[i];
      const [x2, y2] = this._points[(i + 1) % len];
      sum += x1 * y2 - x2 * y1;
    }
    this._area = Math.abs(sum) / 2;
    return this._area;
  }
}

const instructions = input.map(parseInstructionString);
const lagoon = new Lagoon();
lagoon.dig(instructions);
console.log(lagoon.area);