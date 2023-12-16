import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// const input = `.|...\\....
// |.-.\\.....
// .....|-...
// ........|.
// ..........
// .........\\
// ..../.\\\\..
// .-.-/..|..
// .|....-|.\\
// ..//.|....`
//   .split("\n")
//   .map(line => line.split(""));

enum Direction {
  Right,
  Left,
  Up,
  Down
}

class Beam {
  direction: Direction;
  private _row: number;
  private _col: number;

  constructor(options: { row?: number; col?: number; direction?: Direction } = {}) {
    const { row = 0, col = 0, direction = Direction.Right } = options;
    this._row = row;
    this._col = col;
    this.direction = direction;
  }

  step(): Beam {
    const [dR, dC] = this._getDeltas(this.direction);
    this._row += dR;
    this._col += dC;
    return this;
  }

  private _getDeltas(direction: Direction): [dR: number, dC: number] {
    switch (direction) {
      case Direction.Up:
        return [-1, 0];
      case Direction.Right:
        return [0, 1];
      case Direction.Down:
        return [1, 0];
      case Direction.Left:
        return [0, -1];
    }
  }

  get row(): number {
    return this._row;
  }

  get col(): number {
    return this._col;
  }

  get id(): string {
    return `${this.pos},${this.direction}`;
  }

  get pos(): string {
    return `${this._row},${this._col}`;
  }
}

class Contraption {
  private _layout: string[][] = [];
  private _width: number;
  private _height: number;

  constructor(layout: string[][]) {
    this._layout = layout;
    this._width = layout[0].length;
    this._height = layout.length;
  }

  maxEdgeEnergizing(): number {
    const bounces = this._getEdgeStarts().map(start => this.bounce(start));
    return Math.max(...bounces);
  }

  bounce(startBeam: Beam): number {
    const seenBeams: Set<string> = new Set([startBeam.id]);
    const energized: Set<string> = new Set([startBeam.pos]);
    let beams: Beam[] = this._getOutputBeams(startBeam);
    while (beams.length) {
      beams = beams
        .map(beam => beam.step())
        .filter(beam => this._isInBounds(beam))
        .map(beam => this._getOutputBeams(beam))
        .flat()
        .filter(beam => !seenBeams.has(beam.id));
      for (const beam of beams) {
        seenBeams.add(beam.id);
        energized.add(beam.pos);
      }
    }
    return energized.size;
  }

  private _getOutputBeams(beam: Beam): Beam[] {
    const { row, col, direction } = beam;
    let outputDirections: Direction[] = this._getOutDirections(this._layout[row][col], direction);
    return outputDirections.map(newDirection => new Beam({ row, col, direction: newDirection }));
  }

  private _isInBounds(beam: Beam): boolean {
    const { row, col } = beam;
    return row >= 0 && row < this._height && col >= 0 && col < this._width;
  }

  private _getEdgeStarts(): Beam[] {
    const starts: Beam[] = [];
    for (let col = 0; col < this._width; col++) {
      starts.push(new Beam({ row: 0, col, direction: Direction.Down }));
    }
    for (let col = 0; col < this._width; col++) {
      starts.push(new Beam({ row: this._height - 1, col, direction: Direction.Up }));
    }
    for (let row = 0; row < this._height; row++) {
      starts.push(new Beam({ row, col: 0, direction: Direction.Right }));
    }
    for (let row = 0; row < this._height; row++) {
      starts.push(new Beam({ row, col: this._width - 1, direction: Direction.Left }));
    }
    return starts;
  }

  private _getOutDirections(char: string, incomingDirection: Direction): Direction[] {
    switch (char) {
      case "/":
        return {
          [Direction.Up]: [Direction.Right],
          [Direction.Right]: [Direction.Up],
          [Direction.Down]: [Direction.Left],
          [Direction.Left]: [Direction.Down]
        }[incomingDirection];
      case "\\":
        return {
          [Direction.Up]: [Direction.Left],
          [Direction.Right]: [Direction.Down],
          [Direction.Down]: [Direction.Right],
          [Direction.Left]: [Direction.Up]
        }[incomingDirection];
      case "|":
        return {
          [Direction.Up]: [Direction.Up],
          [Direction.Down]: [Direction.Down],
          [Direction.Right]: [Direction.Up, Direction.Down],
          [Direction.Left]: [Direction.Up, Direction.Down]
        }[incomingDirection];
      case "-":
        return {
          [Direction.Up]: [Direction.Right, Direction.Left],
          [Direction.Down]: [Direction.Right, Direction.Left],
          [Direction.Right]: [Direction.Right],
          [Direction.Left]: [Direction.Left]
        }[incomingDirection];
      default:
        return [incomingDirection];
    }
  }
}

// INPUT PROCESSING
const input = readFile(__dirname + "/input.txt", ["\n", ""]) as string[][];

console.time("part1");
console.log(new Contraption(input).bounce(new Beam()));
console.timeEnd("part1");
console.time("part2");
console.log(new Contraption(input).maxEdgeEnergizing());
console.timeEnd("part2");
