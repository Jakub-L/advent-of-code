/**
 * Solution to Day 15 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/15
 */
import { readInput } from '../utils';

// INPUTS
const points: number[][] = readInput('./day-15/input.txt', '\n').map(line =>
  Array.from(line.matchAll(/(?:x|y)=(-?\d+)/g), match => Number(match[1]))
);

// UTILS
type Beacon = Point;
type Limit = { lower: number; upper: number };
type Bounds = { x: Limit; y: Limit };

/** A single point in 2D space */
class Point {
  /** X-coordinate */
  x: number;
  /** Y-coordinate */
  y: number;

  /**
   * Creates a new point
   * @param {number} x - X-coordinate
   * @param {number} y - Y-coordinate
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Finds the Manhattan distance to a point
   * @param {Point | [number, number]} p - Point or pair of coordinates (x, y)
   * @returns {number} Manhattan distance between point and target
   */
  distance(p: Point | [number, number]): number {
    if (Array.isArray(p)) {
      return Math.abs(p[0] - this.x) + Math.abs(p[1] - this.y);
    }
    return Math.abs(p.x - this.x) + Math.abs(p.y - this.y);
  }

  /** Tuning frequency of a beacon/point  */
  get frequency(): number {
    return 4000000 * this.x + this.y;
  }
}

class Sensor extends Point {
  /** X-coordinate */
  x!: number;
  /** Y-coordinate */
  y!: number;
  /** Distance to nearest beacon */
  beaconDistance: number;

  /**
   * Creates a new sensor
   * @param {number} x - X-coordinate
   * @param {number} y - Y-coordinate
   * @param {Beacon} nearestBeacon - Nearest beacon picked up by sensor
   */
  constructor(x: number, y: number, nearestBeacon: Beacon) {
    super(x, y);
    this.beaconDistance = this.distance(nearestBeacon);
  }

  /**
   * Finds the bounds that enclose both this sensor's and target's bounds,
   * i.e. lower bounds are the minimum of either's and upper bounds are the maximum
   * of either.
   * @param {Bounds} b - Other bounds to compare
   * @returns {Bounds} Enclosing bounds
   */
  outerBounds({ x, y }: Bounds): Bounds {
    return {
      x: {
        lower: Math.min(x.lower, this.bounds.x.lower),
        upper: Math.max(x.upper, this.bounds.x.upper)
      },
      y: {
        lower: Math.min(y.lower, this.bounds.y.lower),
        upper: Math.max(y.upper, this.bounds.y.upper)
      }
    };
  }

  /** The minimum/maximum coordinates where there could be another beacon */
  get bounds(): Bounds {
    return {
      x: { lower: this.x - this.beaconDistance - 1, upper: this.x + this.beaconDistance + 1 },
      y: { lower: this.y - this.beaconDistance - 1, upper: this.y + this.beaconDistance + 1 }
    };
  }

  /** Nearest locations that could contain a beacon */
  get boundarySpaces(): Point[] {
    const results: Point[] = [];
    for (let x = -this.beaconDistance - 1; x <= this.beaconDistance + 1; x++) {
      const y = this.beaconDistance + 1 - Math.abs(x);
      results.push(new Point(x + this.x, y + this.y));
      results.push(new Point(x + this.x, -y + this.y));
    }
    return results;
  }
}

/** 2D grid of sensors and beacons */
class Grid {
  /** List of sensors on a grid */
  sensors: Sensor[] = [];
  /** Hashmap of unique beacons and their locations */
  beacons: { [index: string]: Beacon } = {};
  /** Furthest points reached by the sensor sweeps */
  limits: Bounds;

  /**
   * Creates a new Grid
   * @param {number[][]} points - Points defining sensors and beacons in the format
   *      of [sx, sy, bx, by]
   */
  constructor(points: number[][]) {
    for (const [sx, sy, bx, by] of points) {
      let beacon;
      if (`${bx},${by}` in this.beacons) {
        beacon = this.beacons[`${bx},${by}`];
      } else {
        beacon = new Point(bx, by);
        this.beacons[`${bx},${by}`] = beacon;
      }
      this.sensors.push(new Sensor(sx, sy, beacon));
    }
    this.limits = this.findGridBounds();
  }

  /**
   * Counts how many spaces in a row cannot hold a beacon due to being too close to
   * a sensor. Does not count spaces that already have a beacon.
   * @param {number} y - Row to inspect
   * @returns {number} Count of impossible spaces
   */
  countImpossibleBeaconLocations(y: number): number {
    let count = 0;
    for (let x = this.limits.x.lower; x <= this.limits.x.upper; x++) {
      if (
        this.sensors.some(s => s.distance([x, y]) <= s.beaconDistance) &&
        !(`${x},${y}` in this.beacons)
      ) {
        count++;
      }
    }
    return count;
  }

  /**
   * Finds a possible location of a beacon on a grid
   * @param {number} min - Minimum acceptable x and y value for results
   * @param {number} max - Maximum acceptable x and y value for results
   * @returns {Point | null} First found possible beacon location or null if no
   *    location is found
   */
  findBeaconLocation(min: number, max: number): Point | null {
    for (const sensor of this.sensors) {
      for (const point of sensor.boundarySpaces) {
        if (point.x < min || point.y < min || point.x > max || point.y > max) continue;
        if (this.sensors.every(s => s.distance(point) > s.beaconDistance)) return point;
      }
    }
    return null;
  }

  /**
   * Finds the x and y limits that entirely enclose all sensors and their exclusion areas
   * @returns {Bounds} The outer bounds of the grid
   */
  private findGridBounds(): Bounds {
    return this.sensors.reduce((acc, sensor) => sensor.outerBounds(acc), {
      x: { lower: 0, upper: 0 },
      y: { lower: 0, upper: 0 }
    });
  }
}

// PART 1 & 2
const grid = new Grid(points);

// RESULTS
console.log(`Part 1 solution: ${grid.countImpossibleBeaconLocations(2000000)}`);
console.log(`Part 2 solution: ${grid.findBeaconLocation(0, 4000000)?.frequency}`);
