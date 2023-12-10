import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { Queue } from "@jakub-l/aoc-lib/data-structures";

const input = readFile(__dirname + "/input.txt", ["\n", ""]) as string[][];

// const input = `..F7.
// .FJ|.
// SJ.L7
// |F--J
// LJ...`
//   .split("\n")
//   .map(line => line.split(""));

// UTILS
// prettier-ignore
const pipeConnections: Record<string, number[][]> = {
  "|": [[0, -1], [0, 1]],
  "-": [[1, 0], [-1, 0]],
  "L": [[0, -1], [1, 0]],
  "J": [[0, -1], [-1, 0]],
  "7": [[0, 1], [-1, 0]],
  "F": [[0, 1], [1, 0]],
  "S": []
}

/** A single pipe in a network */
class Pipe {
  /** How far the pipe is from the start. If -1, it means the pipe is not connected to starting pipe */
  distanceFromStart: number = -1;
  /** Pipes this pipe is connected to */
  connections: Pipe[] = [];
  /** Position of this pipe (column, row) */
  private _pos: string;
  /** Positions this pipe could be connected to, based on its symbol */
  private _connectedPositions: Set<string> = new Set();

  /**
   * Creates a new pipe
   * @param {string} symbol - Symbol of the pipe as used on the map
   * @param {number} column - Column of the pipe on the map
   * @param {number} row - Row of the pipe on the map
   */
  constructor(symbol: string, column: number, row: number) {
    this._pos = `${column}, ${row}`;
    for (const [dC, dR] of pipeConnections[symbol]) {
      this._connectedPositions.add(`${column + dC}, ${row + dR}`);
    }
  }

  /**
   * Checks if this pipe is connected to the given position
   * @param {string} pos - Position to check (column, row)
   * @returns {boolean} - True if the pipe is connected to the given position, false otherwise
   */
  connectsTo(pos: string): boolean {
    return this._connectedPositions.has(pos);
  }

  /**
   * Maps connections of this pipe to pipes in the given pipe-map.
   * Checks if the position this pipe could connect to is connected _back_ to this pipe.
   * If it is, it adds the pipe to the connections array.
   *
   * @param {Map<string, Pipe>} pipes - Map of all pipes in the network
   */
  mapConnections(pipes: Map<string, Pipe>) {
    for (const potentialConnection of this._connectedPositions) {
      if (pipes.get(potentialConnection)?.connectsTo(this._pos)) {
        this.connections.push(pipes.get(potentialConnection) as Pipe);
      }
    }
  }
}

/** A network of pipes */
class Network {
  /** Map of all pipes in the network */
  pipes: Map<string, Pipe> = new Map();
  /** Position of the starting pipe (column, row) */
  private _start: [number, number] = [-1, -1];
  private _width: number;
  private _height: number;

  /**
   * Creates a new network
   * @param {string[][]} map - Map of the network using symbols
   */
  constructor(map: string[][]) {
    this._height = map.length;
    this._width = map[0].length;
    for (let row = 0; row < this._height; row++) {
      for (let column = 0; column < this._width; column++) {
        const symbol = map[row][column];
        if (symbol === "S") this._start = [column, row];
        else if (symbol !== ".") this.pipes.set(`${column}, ${row}`, new Pipe(symbol, column, row));
      }
    }
    for (const pipe of this.pipes.values()) pipe.mapConnections(this.pipes);
    this._findStartShape();
    this._calculateDistance();
  }

  /**
   * Finds the starting pipe and adds it to the map. Checks the possible connections
   * of the starting pipe by seeing which of the neighbouring positions connect back
   * to the starting position.
   */
  private _findStartShape() {
    const [startColumn, startRow] = this._start;
    const startPos = `${startColumn}, ${startRow}`;
    const startPipe = new Pipe("S", startColumn, startRow);
    startPipe.distanceFromStart = 0;
    // prettier-ignore
    const neighbours = [[0, -1], [0, 1], [1, 0], [-1, 0]];
    for (const [dC, dR] of neighbours) {
      const neighbour = this.pipes.get(`${startColumn + dC}, ${startRow + dR}`);
      if (neighbour?.connectsTo(startPos)) startPipe.connections.push(neighbour);
    }
    this.pipes.set(startPos, startPipe);
  }

  /** Calculates the distance of each pipe from the starting pipe. */
  private _calculateDistance() {
    const [startColumn, startRow] = this._start;
    const startPipe = this.pipes.get(`${startColumn}, ${startRow}`) as Pipe;
    const queue: Queue<Pipe> = new Queue();
    queue.enqueue(startPipe);
    while (queue.size) {
      const pipe = queue.dequeue() as Pipe;
      for (const connection of pipe.connections) {
        if (connection.distanceFromStart === -1) {
          connection.distanceFromStart = pipe.distanceFromStart + 1;
          queue.enqueue(connection);
        }
      }
    }
  }

  /** Maximum distance from the start of any pipe connected to the starting pipe */
  get maxDistance(): number {
    let maxDistance = 0;
    for (const pipe of this.pipes.values()) {
      if (pipe.distanceFromStart > maxDistance) maxDistance = pipe.distanceFromStart;
    }
    return maxDistance;
  }
}

const network = new Network(input);
console.log(network.maxDistance);
