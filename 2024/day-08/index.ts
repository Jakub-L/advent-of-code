import { readFile } from "@jakub-l/aoc-lib/input-parsing";

const input: string[][] = readFile(__dirname + "/input.txt", ["\n", ""]) as string[][];

// Part 1 & 2
/** A 2D Vector */
class Vector2 {
  /** The x-coordinate */
  public x: number;
  /** The y-coordinate */
  public y: number;

  /** Creates a new 2D vector */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Adds another vector to this vector
   * @param {Vector2} other - The vector to add
   * @returns {Vector2} The sum of the two vectors
   */
  add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  /**
   * Subtracts another vector from this vector
   * @param {Vector2} other - The vector to subtract
   * @returns {Vector2} The difference of the two vectors
   */
  subtract(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  /**
   * Multiplies this vector by a scalar factor
   * @param {number} factor - The factor to multiply by
   * @returns {Vector2} The vector multiplied by the factor
   */
  multiply(factor: number): Vector2 {
    return new Vector2(this.x * factor, this.y * factor);
  }

  /**
   * Returns a string representation of the vector
   * @returns {string} The string representation of the vector
   */
  toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}

/** A class representing an antenna */
class Antenna {
  /** The location of the antenna */
  public location: Vector2;
  /** The height of the map containing the antenna */
  private _mapHeight: number;
  /** The width of the map containing the antenna */
  private _mapWidth: number;

  /**
   * Creates a new antenna
   * @param {number} x - The x-coordinate of the antenna
   * @param {number} y - The y-coordinate of the antenna
   * @param {number} mapWidth - The width of the map containing the antenna
   * @param {number} mapHeight - The height of the map containing the antenna
   */
  constructor(x: number, y: number, mapWidth: number, mapHeight: number) {
    this._mapHeight = mapHeight;
    this._mapWidth = mapWidth;
    this.location = new Vector2(x, y);
  }

  /**
   * Checks if a node is within the bounds of the map
   * @param {Vector2} node - The node to check
   * @returns {boolean} True if the node is within the bounds of the map, false otherwise
   */
  private _isInBounds(node: Vector2): boolean {
    return node.x >= 0 && node.x < this._mapWidth && node.y >= 0 && node.y < this._mapHeight;
  }

  /**
   * Gets the antinodes of this antenna with another antenna
   * @param {Antenna} other - The other antenna
   * @param {boolean} useHarmonics - Whether to use harmonics
   * @returns {Vector2[]} The antinodes of the two antennas
   */
  getAntinodes(other: Antenna, useHarmonics: boolean): Vector2[] {
    const dir = other.location.subtract(this.location);
    const nodes: Vector2[] = [];
    if (useHarmonics) {
      const maxSize = Math.max(this._mapHeight, this._mapWidth);
      for (let i = -maxSize; i < maxSize; i++) {
        nodes.push(this.location.add(dir.multiply(i)));
      }
    } else {
      nodes.push(this.location.add(dir.multiply(2)));
      nodes.push(this.location.subtract(dir));
    }
    return nodes.filter(node => this._isInBounds(node));
  }
}

/** A class representing a map of a city */
class CityMap {
  /** A map of antennas by frequency */
  private _antennas: Map<string, Antenna[]> = new Map();
  /** The antinodes of the antennas */
  private _antinodes: Vector2[] = [];

  /**
   * Creates a new city map
   * @param {string[][]} map - The map of the city
   */
  constructor(map: string[][]) {
    const mapHeight = map.length;
    const mapWidth = map[0].length;
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const char = map[y][x];
        if (char !== ".") {
          const frequencyAntennas = this._antennas.get(char) || [];
          this._antennas.set(char, [...frequencyAntennas, new Antenna(x, y, mapWidth, mapHeight)]);
        }
      }
    }
  }

  /**
   * Gets the antinodes of the antennas
   * @param {boolean} useHarmonics - Whether to use harmonics
   */
  private _getAntinodes(useHarmonics: boolean) {
    for (const antennas of this._antennas.values()) {
      for (let i = 0; i < antennas.length; i++) {
        for (let j = i + 1; j < antennas.length; j++) {
          this._antinodes.push(...antennas[i].getAntinodes(antennas[j], useHarmonics));
        }
      }
    }
  }

  /**
   * Counts the number of antinodes
   * @param {boolean} useHarmonics - Whether to use harmonics
   * @returns {number} The number of unique antinode positions
   */
  public antinodeCount(useHarmonics: boolean = false): number {
    this._getAntinodes(useHarmonics);
    const set = new Set<string>();
    for (const node of this._antinodes) {
      set.add(node.toString());
    }
    return set.size;
  }
}

// Results
const cityMap = new CityMap(input);
console.log(`Part 1: ${cityMap.antinodeCount()}`);
console.log(`Part 2: ${cityMap.antinodeCount(true)}`);
