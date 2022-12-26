/**
 * Solution to Day 22 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/22
 */
import { readInput } from '../utils';

// INPUTS
const [rawChars, rawInstructions]: string[] = readInput('./day-22/input.txt', '\n\n');

const chars: string[][] = rawChars.split('\n').map(r => r.split(''));
const instructions: Instruction[] = rawInstructions
  .split(/(L|R)/g)
  .map(e => (isNaN(+e) ? e : +e));

// UTILS
type Instruction = number | string;
type Face = {
  faceRow: number;
  faceCol: number;
  chars: string[][];
  name: string;
  neighbours: string[];
};

const facings: number[][] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1]
];
const faceNames: { [name: string]: string[] } = {
  u: ['r', 'f', 'l', 'b'],
  d: ['b', 'l', 'f', 'r'],
  r: ['u', 'b', 'd', 'f'],
  l: ['f', 'd', 'b', 'u'],
  f: ['u', 'r', 'd', 'l'],
  b: ['l', 'd', 'r', 'u']
};

/**
 * Finds the positive modulo of a division
 * @param {number} x - Dividend
 * @param {number} m - Divisor
 * @returns {number} x % m wrapped around to be positive
 */
const posMod = (x: number, m: number): number => (x % m < 0 ? (x % m) + m : x % m);

/** Monkey map interpreted as a 2D flat map */
class Map2D {
  /** Column */
  x: number = -1;
  /** Row */
  y: number = -1;
  /** Facing */
  f: number = 0;
  /** Set of walls (impassable spaces) */
  walls: Set<string> = new Set();
  /** Set of empty spaces */
  space: Set<string> = new Set();
  /** Minimum and maximum indices for each row */
  rowMinMax: (number | undefined)[][] = [];
  /** Minimum and maximum indices for each column */
  colMinMax: (number | undefined)[][] = [];

  /**
   * Creates a new 2D monkey map
   * @param {string[][]} chars - Input map split into single-character length
   */
  constructor(chars: string[][]) {
    for (let y = 0; y < chars.length; y++) {
      this.rowMinMax[y] = [undefined, chars[y].length - 1];
      for (let x = 0; x < chars[y].length; x++) {
        const char = chars[y][x];
        // Find the minimum and maximum indices for this column
        if (char !== ' ') {
          if (this.colMinMax[x] === undefined) this.colMinMax[x] = [];
          if (this.colMinMax[x][0] === undefined) this.colMinMax[x][0] = y;
          this.colMinMax[x][1] = y;
        }
        // Find the minimum index for this row
        if (char !== ' ' && this.rowMinMax[y][0] === undefined) this.rowMinMax[y][0] = x;
        if (this.x < 0 && this.y < 0 && y === 0 && char !== ' ') {
          this.x = x;
          this.y = y;
        }
        if (char === '#') this.walls.add(`${x},${y}`);
        if (char === '.') this.space.add(`${x},${y}`);
      }
    }
  }

  /**
   * Parses an array of instructions and moves/rotates appropriately
   * @param {Instruction[]} instructions - Set of instruction
   */
  parseInstructions(instructions: Instruction[]) {
    for (const instruction of instructions) {
      if (typeof instruction === 'number') this.move(instruction);
      else this.rotate(instruction);
    }
  }

  /** The final map password */
  get password(): number {
    return 1000 * (this.y + 1) + 4 * (this.x + 1) + this.f;
  }

  /**
   * Changes the facing based on the rotation direction
   * @param {string} dir - Whether to move clockwise (R) or counterclockwise (L)
   */
  private rotate(dir: string) {
    do {
      this.f = (this.f + (dir === 'R' ? 1 : -1) + 4) % 4;
    } while (this.f < 0);
  }

  /**
   * Moves a number of grid spaces along the map. Stops at walls.
   * @param {number} dist - Distance to move
   */
  private move(dist: number) {
    const [dx, dy] = facings[this.f];
    for (let i = 0; i < dist; i++) {
      const [x, y] = [this.x + dx, this.y + dy];
      if (this.walls.has(`${x},${y}`)) break;
      if (this.space.has(`${x},${y}`)) {
        this.x = x;
        this.y = y;
      } else {
        const [wrapX, wrapY] = this.wrap(x, y, dx, dy);
        if (this.walls.has(`${wrapX},${wrapY}`)) break;
        this.x = wrapX;
        this.y = wrapY;
      }
    }
  }

  /**
   * Wraps the move around edges of a map
   * @param {number} x - Column after attempted move
   * @param {number} y - Row after attempted move
   * @param {number} dx - Column distance moved
   * @param {number} dy - Row distance moved
   * @returns {number[]} [x, y] after wrapping around edge
   */
  private wrap(x: number, y: number, dx: number, dy: number): number[] {
    let wrapX = x;
    let wrapY = y;
    if (dx === 0) {
      if (dy === 1) wrapY = this.colMinMax[x][0] as number;
      if (dy === -1) wrapY = this.colMinMax[x][1] as number;
    } else if (dy === 0) {
      if (dx === 1) wrapX = this.rowMinMax[y][0] as number;
      if (dx === -1) wrapX = this.rowMinMax[y][1] as number;
    }
    return [wrapX, wrapY];
  }
}

/** Monkey map interpreted as a net of a 3D cube */
class Map3D {
  /** Collection of individual cube faces */
  faces: Face[] = [];
  /** 2D map connecting faces to their locations on the net */
  faceMap: (number | null)[][] = [];
  /** Length of the edge of the cube */
  size: number;
  /** Column on a face */
  x: number = 0;
  /** Row on a face */
  y: number = 0;
  /** Facing */
  f: number = 0;
  /** Face */
  face: number = 0;

  /**
   * Creates a new 3D monkey map
   * @param {string[][]} chars - Input map split into single-character length
   */
  constructor(chars: string[][]) {
    const size = Math.sqrt(chars.flat().filter(c => c !== ' ').length / 6);
    const longestLine = chars.reduce((max, line) => Math.max(max, line.length), 0);
    let faceIndex = 0;
    this.size = size;

    for (let faceRow = 0; faceRow < chars.length / size; faceRow++) {
      this.faceMap[faceRow] = [];
      for (let faceCol = 0; faceCol < longestLine / size; faceCol++) {
        const char = chars[faceRow * size][faceCol * size];
        if (char && char !== ' ') {
          this.faces[faceIndex] = {
            name: '',
            neighbours: [],
            faceRow,
            faceCol,
            chars: chars
              .slice(faceRow * size, (faceRow + 1) * size)
              .map(row => row.slice(faceCol * size, (faceCol + 1) * size))
          };
          this.faceMap[faceRow][faceCol] = faceIndex++;
        } else this.faceMap[faceRow][faceCol] = null;
      }
    }
  }

  /**
   * Parses an array of instructions and moves/rotates appropriately
   * @param {Instruction[]} instructions - Set of instruction
   */
  parseInstructions(instructions: Instruction[]) {
    this.connectNeighbours();
    for (const instruction of instructions) {
      if (typeof instruction === 'number') this.move(instruction);
      else this.rotate(instruction);
    }
  }

  /** The final map password */
  get password(): number {
    return (
      1000 * (this.faces[this.face].faceRow * this.size + this.y + 1) +
      4 * (this.faces[this.face].faceCol * this.size + this.x + 1) +
      this.f
    );
  }

  /**
   * Changes the facing based on the rotation direction
   * @param {string} dir - Whether to move clockwise (R) or counterclockwise (L)
   */
  private rotate(dir: string) {
    do {
      this.f = (this.f + (dir === 'R' ? 1 : -1) + 4) % 4;
    } while (this.f < 0);
  }

  /**
   * Moves a number of grid spaces along the map. Stops at walls.
   * @param {number} dist - Distance to move
   */
  private move(dist: number) {
    for (let i = 0; i < dist; i++) {
      const [dx, dy] = facings[this.f];
      let [x, y] = [this.x + dx, this.y + dy];
      let [f, face] = [this.f, this.face];

      if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
        x = posMod(x, this.size);
        y = posMod(y, this.size);
        face = this.faces.findIndex(({ name }) => name === this.faces[face].neighbours[f]);
        while (this.faces[face].neighbours[(f + 2) % 4] !== this.faces[this.face].name) {
          [x, y] = [this.size - 1 - y, x];
          f = (f + 1) % 4;
        }
      }
      if (this.faces[face].chars[y][x] === '#') break;
      this.x = x;
      this.y = y;
      this.f = f;
      this.face = face;
    }
  }

  /**
   * Creates an array of neighbouring faces at each facing
   * @param {Face} face - Face which neighbours are to be found
   * @param {number} f - The facing to investigate
   * @param {string} neighborName - Name of neighbouring face
   */
  private getNeighbours(face: Face, f: number, neighborName: string) {
    const faceIdx = faceNames[face.name].indexOf(neighborName);
    for (let i = 0; i < 4; ++i) {
      face.neighbours[(f + i) % 4] = faceNames[face.name as string][(faceIdx + i) % 4];
    }
  }

  /** Recursively connects all faces as they would be on a folded 3D cube */
  private connectNeighbours() {
    /**
     * Recursive connecting function. Joins a face to its neighbours
     * @param {number} id - Id of the face to connect
     * @param {Set.<number>} [complete=new Set()] - Set of already connected faces
     */
    const recursiveSearch = (id: number, complete: Set<number> = new Set()) => {
      complete.add(id);
      const { faceRow, faceCol, neighbours: faceNeighbours, name: faceName } = this.faces[id];
      const neighbouringIds = [
        this.faceMap[faceRow][faceCol + 1],
        this.faceMap[faceRow + 1]?.[faceCol],
        this.faceMap[faceRow][faceCol - 1],
        this.faceMap[faceRow - 1]?.[faceCol]
      ];
      for (let i = 0; i < neighbouringIds.length; i++) {
        const targetId = neighbouringIds[i] as number;
        if (targetId && !complete.has(targetId)) {
          this.faces[targetId].name = faceNeighbours[i];
          this.getNeighbours(this.faces[targetId], (i + 2) % 4, faceName);
          recursiveSearch(targetId, complete);
        }
      }
    };

    // Arbitrality the first face is designated the 'up' face.
    // Similarly, the face to its 'east' (facing 0) is designated the 'right' face.
    this.faces[0].name = 'u';
    this.getNeighbours(this.faces[0], 0, 'r');
    recursiveSearch(0);
  }
}

// PART 1
const flatMap = new Map2D(chars);
flatMap.parseInstructions(instructions);

// PART 2
const cubeMap = new Map3D(chars);
cubeMap.parseInstructions(instructions);

// RESULTS
console.log(`Part 1 solution: ${flatMap.password}`);
console.log(`Part 2 solution: ${cubeMap.password}`);
