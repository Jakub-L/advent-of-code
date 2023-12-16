import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// UTILS
type Tile = "/" | "\\" | "|" | "-" | ".";
enum Direction {
  Right,
  Left,
  Up,
  Down
}

/** The mapping of direction of movement to row and column deltas */
const directionToDelta: Record<Direction, number[]> = {
  [Direction.Up]: [-1, 0],
  [Direction.Right]: [0, 1],
  [Direction.Down]: [1, 0],
  [Direction.Left]: [0, -1]
};

/** The mapping of incoming direction and encountered character to output directions */
const charToOutputDirections: Record<Tile, Record<Direction, Direction[]>> = {
  "/": {
    [Direction.Up]: [Direction.Right],
    [Direction.Right]: [Direction.Up],
    [Direction.Down]: [Direction.Left],
    [Direction.Left]: [Direction.Down]
  },
  "\\": {
    [Direction.Up]: [Direction.Left],
    [Direction.Right]: [Direction.Down],
    [Direction.Down]: [Direction.Right],
    [Direction.Left]: [Direction.Up]
  },
  "|": {
    [Direction.Up]: [Direction.Up],
    [Direction.Down]: [Direction.Down],
    [Direction.Right]: [Direction.Up, Direction.Down],
    [Direction.Left]: [Direction.Up, Direction.Down]
  },
  "-": {
    [Direction.Up]: [Direction.Right, Direction.Left],
    [Direction.Down]: [Direction.Right, Direction.Left],
    [Direction.Right]: [Direction.Right],
    [Direction.Left]: [Direction.Left]
  },
  ".": {
    [Direction.Up]: [Direction.Up],
    [Direction.Down]: [Direction.Down],
    [Direction.Right]: [Direction.Right],
    [Direction.Left]: [Direction.Left]
  }
};

/** A single beam moving through the contraption */
class Beam {
  /** The direction the beam is moving */
  direction: Direction;
  /** The row of the beam front */
  row: number;
  /** The column of the beam front */
  col: number;

  /**
   * Create a new beam
   * @param {object} options - The options for the beam
   * @param {number} options.row - The row of the beam front. Defaults to 0
   * @param {number} options.col - The column of the beam front. Defaults to 0
   * @param {Direction} options.direction - The direction the beam is moving. Defaults to Right
   */
  constructor(options: { row?: number; col?: number; direction?: Direction } = {}) {
    const { row = 0, col = 0, direction = Direction.Right } = options;
    this.row = row;
    this.col = col;
    this.direction = direction;
  }

  /**
   * Move the beam one step forward along its current direction.
   * @returns {Beam} The beam after moving one step
   */
  step(): Beam {
    const [dR, dC] = directionToDelta[this.direction];
    this.row += dR;
    this.col += dC;
    return this;
  }

  /**
   * Get a unique identifier for the beam, based on its position and direction
   * @returns {string} The identifier of the beam
   */
  get id(): string {
    return `${this.pos},${this.direction}`;
  }

  /**
   * Get the current position of the beam
   * @returns {string} The position of the beam
   */
  get pos(): string {
    return `${this.row},${this.col}`;
  }
}

class Contraption {
  /** The contraption layout */
  private _layout: Tile[][] = [];
  /** The width of the layout (number of columns) */
  private _width: number;
  /** The height of the layout (number of rows) */
  private _height: number;

  /**
   * Create a new contraption
   * @param {Tile[][]} layout - The layout of the contraption
   */
  constructor(layout: Tile[][]) {
    this._layout = layout;
    this._width = layout[0].length;
    this._height = layout.length;
  }

  /**
   * Simulate a beam bouncing around the contraption.
   * @param {Beam} startBeam - The beam to start with. Defaults to a beam starting at the top left,
   *       moving right.
   * @returns {number} The number of tiles that will be energized.
   */
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

  /**
   * Finds the maximum possible number of energized tiles, assuming the beams can enter
   * from any edge tile.
   * @returns {number} The maximum number of tiles that will be energized.
   */
  maxEdgeEnergizing(): number {
    const bounces = this._getEdgeStarts().map(start => this.bounce(start));
    return Math.max(...bounces);
  }

  /**
   * Get the beams that would be output from a given beam's current position. This takes
   * into account the Tile at the beam's current position and the direction it is moving.
   * @param {Beam} beam - The beam to get the output beams from
   * @returns {Beam[]} The beams that would be output from the incoming beam hitting the current
   *        character.
   */
  private _getOutputBeams(beam: Beam): Beam[] {
    const { row, col, direction } = beam;
    let outputDirections: Direction[] = charToOutputDirections[this._layout[row][col]][direction];
    return outputDirections.map(newDirection => new Beam({ row, col, direction: newDirection }));
  }

  /**
   * Checks if a beam is still within bounds of a layout
   * @param {Beam} beam - Beam to check
   * @returns {boolean} True if beam's current position is within the layout
   */
  private _isInBounds(beam: Beam): boolean {
    const { row, col } = beam;
    return row >= 0 && row < this._height && col >= 0 && col < this._width;
  }

  /**
   * Get the beams starting on the edges of the contraption. For corner locations,
   * two beams will be returned, one for each possible direction.
   * @returns {Beam[]} The beams starting on the edges
   */
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
}

// INPUT PROCESSING
const input = readFile(__dirname + "/input.txt", ["\n", ""]) as Tile[][];

// RESULTS
console.log(`Part 1: ${new Contraption(input).bounce(new Beam())}`);
console.log(`Part 2: ${new Contraption(input).maxEdgeEnergizing()}`);
