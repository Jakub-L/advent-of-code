import { Counter } from "@jakub-l/aoc-lib/collections";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";

const input: string[][] = readFile(__dirname + "/input.txt", ["\n", ""]) as string[][];
const sample = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`
  .split("\n")
  .map(l => l.split(""));

// Part 1
class Vector2 {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(other: number): Vector2;
  add(other: Vector2): Vector2;
  add(other: number | Vector2): Vector2 {
    if (typeof other === "number") {
      return new Vector2(this.x + other, this.y + other);
    }
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  subtract(other: number): Vector2;
  subtract(other: Vector2): Vector2;
  subtract(other: number | Vector2): Vector2 {
    if (typeof other === "number") {
      return new Vector2(this.x - other, this.y - other);
    }
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  multiply(vector: Vector2): Vector2;
  multiply(factor: number): Vector2;
  multiply(factor: number | Vector2): Vector2 {
    if (typeof factor === "number") {
      return new Vector2(this.x * factor, this.y * factor);
    }
    return new Vector2(this.x * factor.x, this.y * factor.y);
  }

  toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}

class Antenna {
  public frequency: string;
  public location: Vector2;
  private _mapHeight: number;
  private _mapWidth: number;

  constructor(frequency: string, x: number, y: number, mapWidth: number, mapHeight: number) {
    this._mapHeight = mapHeight;
    this._mapWidth = mapWidth;
    this.frequency = frequency;
    this.location = new Vector2(x, y);
  }

  private _isInBounds(node: Vector2): boolean {
    return node.x >= 0 && node.x < this._mapWidth && node.y >= 0 && node.y < this._mapHeight;
  }

  getAntinodes(other: Antenna, useHarmonics: boolean = false): Vector2[] {
    if (this.frequency !== other.frequency) return [];
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

class CityMap {
  private _antennas: Map<string, Antenna[]> = new Map();
  private _antinodes: Map<string, Vector2[]> = new Map();

  constructor(map: string[][]) {
    const mapHeight = map.length;
    const mapWidth = map[0].length;
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const char = map[y][x];
        if (char !== ".") {
          const frequencyAntennas = this._antennas.get(char) || [];
          this._antennas.set(char, [
            ...frequencyAntennas,
            new Antenna(char, x, y, mapWidth, mapHeight)
          ]);
        }
      }
    }
  }

  private _getAntinodes(useHarmonics: boolean) {
    for (const [frequency, antennas] of this._antennas.entries()) {
      const antinodes = [];
      for (let i = 0; i < antennas.length; i++) {
        for (let j = i + 1; j < antennas.length; j++) {
          antinodes.push(...antennas[i].getAntinodes(antennas[j], useHarmonics));
        }
      }
      this._antinodes.set(frequency, antinodes);
    }
  }

  public antinodeCount(useHarmonics: boolean): number {
    this._getAntinodes(useHarmonics);
    const set = new Set<string>();
    for (const antinodes of this._antinodes.values()) {
      for (const node of antinodes) {
        set.add(node.toString());
      }
    }
    return set.size;
  }
}

const cityMap = new CityMap(input);
console.log(cityMap.antinodeCount(true));
