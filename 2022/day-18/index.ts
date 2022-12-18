/**
 * Solution to Day 18 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/18
 */
import { readInput } from '../utils';

// INPUTS
const locations: Point3D[] = readInput('./day-18/input.txt')
  .map(row => row.split(',').map(Number) as Point3D);

// UTILS
type Point3D = [number, number, number];

const neighbours: Point3D[] = [
  [-1, 0, 0], [1, 0, 0],
  [0, -1, 0], [0, 1, 0],
  [0, 0, -1], [0, 0, 1]
];

/**
 * Adds two points coordinate-by-coordinate
 * @param {Point3D} a - First point to add
 * @param {Point3D} b - First point to add
 * @returns {Point3D} Sum of two points
 */
const add = (a: Point3D, b: Point3D): Point3D => a.map((coord, i) => coord + b[i]) as Point3D;

/** Single pixel */
class Pixel {
  /** Location of the pixel */
  location: Point3D;
  /** Key identifying the pixel (string form of the location) */
  key: string;
  /** Map of neighbouring points */
  neighbours: Map<string, Point3D> = new Map();

  /**
   * Create a new volcanic pixel
   * @param {Point3D} location - Point occupied by pixel
   */
  constructor(location: Point3D) {
    this.location = location;
    this.key = JSON.stringify(location);
    for (const neighbour of neighbours) {
      const point = add(location, neighbour);
      const key = JSON.stringify(point);
      this.neighbours.set(key, point);
    }
  }
}

/** Volcanic droplet */
class Droplet {
  /** Pixels forming part of the droplet */
  private pixels: Map<string, Pixel> = new Map();
  /** Surface area of the droplet, including internal voids */
  surfaceArea: number;
  /** Surface area of the droplet, only counting external faces */
  outerSurfaceArea: number;
  /** Coordinates containing the entirety of the droplet */
  private boundingBox: number[][] = [];

  /**
   * Creates a new droplet
   * @param {Point3D[]} locations - Array of pixel locations
   */
  constructor(locations: Point3D[]) {
    for (const location of locations) {
      const p = new Pixel(location);
      this.pixels.set(p.key, p);
    }
    this.surfaceArea = this._getSurfaceArea();
    this.boundingBox = this._getBoundingBox();
    this.outerSurfaceArea = this._getOuterSurfaceArea();
  }

  /**
   * Finds the surface area of the droplet that faces the outside
   * @returns {number} Outer surface area
   */
  private _getOuterSurfaceArea(): number {
    const waterPixels: Map<string, Pixel> = new Map();
    const queue: Point3D[] = [this.boundingBox.map(([min]) => min) as Point3D];
    while (queue.length > 0) {
      const pixel = new Pixel(queue.shift() as Point3D);
      if (waterPixels.has(pixel.key)) continue;
      waterPixels.set(pixel.key, pixel);
      for (const [key, point] of pixel.neighbours) {
        if (this._isWithinBox(point) && !this.pixels.has(key)) queue.push(point);
      }
    }
    let area = 0
    for (const pixel of waterPixels.values()) {
      for (const neighbour of pixel.neighbours.keys()) {
        if (this.pixels.has(neighbour)) area += 1
      }
    }
    return area;
  }

  /**
   * Finds the total surface area of the droplet, including inner voids
   * @returns {number} The surface area
   */
  private _getSurfaceArea(): number {
    let area = 0;
    for (const pixel of this.pixels.values()) {
      for (const neighbour of pixel.neighbours.keys()) {
        if (!this.pixels.has(neighbour)) area += 1;
      }
    }
    return area;
  }

  /**
   * Calculates the minimum and maximum coordinate values to completely enclose the droplet's pixels
   * @returns {number[][]} The bounding box in the format 
   *    [[xmin, xmax], [ymin, ymax], [zmin, zmax]]
   */
  private _getBoundingBox(): number[][] {
    let bounds = Array(3).fill([Infinity, -Infinity]);
    for (const pixel of this.pixels.values()) {
      bounds = bounds.map(([min, max], i) => [
        Math.min(min, pixel.location[i] - 1),
        Math.max(max, pixel.location[i] + 1)
      ]);
    }
    return bounds;
  }

  /**
   * Finds whether a point is within the bounding box
   * @param {Point3D} point - Point to check
   * @returns {boolean} True if point lies within the bounding box, false otherwise
   */
  private _isWithinBox(point: Point3D): boolean {
    if (this.boundingBox.length === 0) this._getBoundingBox()
    return point.every((c, i) => c >= this.boundingBox[i][0] && c <= this.boundingBox[i][1]);
  }
}

// PART 1 & 2
const droplet = new Droplet(locations);

// RESULTS
console.log(`Part 1 solution: ${droplet.surfaceArea}`)
console.log(`Part 2 solution: ${droplet.outerSurfaceArea}`)