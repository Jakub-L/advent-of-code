import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { Queue } from "@jakub-l/aoc-lib/data-structures";

// UTILS
type Coord = [r: number, c: number];
const validSlopeMoves: Record<string, Coord[]> = { v: [[1, 0]], "^": [[-1, 0]], ">": [[0, 1]], "<": [[0, -1]] };
const neighbourMoves: Coord[] = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0]
];

class Trail {
  private _layout: string[][];
  private _start: Coord;
  private _end: Coord;
  private _ignoreSlope: boolean = false;
  private _vertices: Map<string, Coord> = new Map();
  private _edges: Map<string, Map<string, number>> = new Map();
  private _longestHike: number = -1;

  constructor(layout: string[][], start?: Coord, end?: Coord) {
    this._layout = layout;
    this._ignoreSlope = true;
    this._start = start ?? [0, 1];
    this._end = end ?? [layout.length - 1, layout[0].length - 2];
    this._vertices = this._getVertices();
    this._edges = this._getEdges();
  }

  longestHike(ignoreSlope: boolean = false): number {
    if (ignoreSlope !== this._ignoreSlope) {
      this._ignoreSlope = ignoreSlope;
      this._vertices = this._getVertices();
      this._edges = this._getEdges();
      this._longestHike = -1;
    }
    if (this._longestHike > -1) return this._longestHike;
    this._dfs(this._start.join(), this._end.join(), new Set(), 0);
    return this._longestHike;
  }

  private _dfs(currId: string, endId: string, visited: Set<string>, dist: number) {
    if (currId === endId) this._longestHike = Math.max(this._longestHike, dist);
    for (const [connectionId, edgeLength] of this._edges.get(currId)!) {
      if (!visited.has(connectionId)) {
        visited.add(connectionId);
        this._dfs(connectionId, endId, visited, dist + edgeLength);
        visited.delete(connectionId);
      }
    }
  }

  private _getVertices(): Map<string, Coord> {
    const vertices = new Map();
    for (let r = 0; r < this._layout.length; r++) {
      for (let c = 0; c < this._layout[r].length; c++) {
        const char = this._layout[r][c];
        if (char === "#") continue;
        if (this._getAdjacent([r, c]).length > 2) vertices.set(`${r},${c}`, [r, c]);
      }
    }
    vertices.set(`${this._start.join()}`, this._start);
    vertices.set(`${this._end.join()}`, this._end);
    return vertices;
  }

  private _getEdges(): Map<string, Map<string, number>> {
    const edges = new Map();
    for (const vertex of this._vertices.values()) {
      const connections = new Map();
      const queue = new Queue<{ point: Coord; dist: number }>();
      queue.enqueue({ point: vertex, dist: 0 });
      const visited: Set<string> = new Set([`${vertex.join()}`]);
      while (!queue.isEmpty) {
        const { point, dist } = queue.dequeue();
        for (const adjacent of this._getAdjacent(point)) {
          if (!visited.has(`${adjacent.join()}`)) {
            visited.add(`${adjacent.join()}`);
            if (this._vertices.has(`${adjacent.join()}`)) connections.set(`${adjacent.join()}`, dist + 1);
            else queue.enqueue({ point: adjacent, dist: dist + 1 });
          }
        }
      }
      edges.set(`${vertex.join()}`, connections);
    }
    return edges;
  }

  private _getAdjacent([r, c]: Coord): Coord[] {
    const validMoves: Coord[] = [];
    const curr = this._layout[r][c];
    // If we're not ignoring slopes and we currently are on a slope, we only have one valid move
    const allowedMoves = !this._ignoreSlope && curr in validSlopeMoves ? validSlopeMoves[curr] : neighbourMoves;
    for (const move of allowedMoves) {
      const [dr, dc] = move;
      const [rr, cc] = [r + dr, c + dc];
      const char = this._layout[rr]?.[cc];
      if (char && char !== "#") validMoves.push([rr, cc]);
    }
    return validMoves;
  }
}

// INPUT PARSING
const input = readFile(__dirname + "/input.txt", ["\n", ""]) as string[][];
const trail = new Trail(input);

// RESULTS
console.log(`Part 1: ${trail.longestHike()}`);
console.log(`Part 2: ${trail.longestHike(true)}`);
