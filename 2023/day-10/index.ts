import { readFile } from "@jakub-l/aoc-lib/input-parsing";

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

class Pipe {
  distanceFromStart: number = -1;
  connections: Pipe[] = [];
  private _connectedPositions: Set<string> = new Set();
  private _pos: string;

  constructor(public symbol: string, column: number, row: number) {
    this._pos = `${column}, ${row}`;
    for (const [dC, dR] of pipeConnections[symbol]) {
      this._connectedPositions.add(`${column + dC}, ${row + dR}`);
    }
  }

  connectsTo(pos: string) {
    return this._connectedPositions.has(pos);
  }

  mapConnections(pipes: Map<string, Pipe>) {
    for (const potentialConnection of this._connectedPositions) {
      if (pipes.get(potentialConnection)?.connectsTo(this._pos)) {
        this.connections.push(pipes.get(potentialConnection) as Pipe);
      }
    }
  }
}

class Network {
  pipes: Map<string, Pipe> = new Map();
  private _start: [number, number] = [-1, -1];

  constructor(map: string[][]) {
    for (let row = 0; row < map.length; row++) {
      for (let column = 0; column < map[0].length; column++) {
        const symbol = map[row][column];
        if (symbol === "S") this._start = [column, row];
        else if (symbol !== ".") this.pipes.set(`${column}, ${row}`, new Pipe(symbol, column, row));
      }
    }
    for (const pipe of this.pipes.values()) {
      pipe.mapConnections(this.pipes);
    }
    this._findStartShape();
    this._calculateDistance();
  }

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

  private _calculateDistance() {
    const [startColumn, startRow] = this._start;
    const startPipe = this.pipes.get(`${startColumn}, ${startRow}`) as Pipe;

    const queue: Pipe[] = [startPipe];
    while (queue.length) {
      const pipe = queue.shift() as Pipe;
      for (const connection of pipe.connections) {
        if (connection.distanceFromStart === -1) {
          connection.distanceFromStart = pipe.distanceFromStart + 1;
          queue.push(connection);
        }
      }
    }
  }

  get maxDistance(): number {
    let maxDistance = 0;
    for (const pipe of this.pipes.values()) {
      if (pipe.distanceFromStart > maxDistance) maxDistance = pipe.distanceFromStart;
    }
    return maxDistance;
  }
}

const network = new Network(input);
console.log(network.maxDistance)