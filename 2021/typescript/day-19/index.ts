/**
 * Solution to Day 19 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/19
 */
import { readInput } from '../utils';

// TYPES
type BeaconIntersection = {
  indexInTarget: number;
  indexInSelf: number;
};
type ScannerIntersection = {
  intersections: BeaconIntersection[];
  targetBeacon: Beacon;
  selfBeacon: Beacon;
};

// INPUTS
let rawData = readInput('./../../inputs/day-19.txt', '\n\n').map((scanner) =>
  scanner
    .replace(/--- scanner \d+ ---\n/, '')
    .split('\n')
    .map((signal) => signal.split(',').map(Number))
);

// UTILS
/** Class representing a single beacon's signal */
class Beacon {
  /** x coordinate of the beacon with respect to the parent scanner */
  x: number;
  /** y coordinate of the beacon with respect to the parent scanner */
  y: number;
  /** z coordinate of the beacon with respect to the parent scanner */
  z: number;
  /** ID of the beacon, its number in the parent scanner's list */
  id: number;
  /** List of relative distances along each axis (sorted from shortest to longest) to other beacons in its parent */
  distances: string[] = [];

  /**
   * Creates a new beacon
   * @param {number} x - x coordinate of the beacon with respect to the parent scanner
   * @param {number} y - y coordinate of the beacon with respect to the parent scanner
   * @param {number} z - z coordinate of the beacon with respect to the parent scanner
   * @param {number} id - ID of the beacon, its number in the parent scanner's list
   */
  constructor(x: number, y: number, z: number, id: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.id = id;
  }

  /**
   * Finds the relative distances between this beacon and target beacon, along each of the three axes.
   * The values are then sorted from lowest to highest and arranges
   * @param {Beacon} target - Target Beacon to compare
   */
  findRange(target: Beacon) {
    const relativeDistance = [
      Math.abs(this.x - target.x),
      Math.abs(this.y - target.y),
      Math.abs(this.z - target.z),
    ]
      .sort((a, b) => a - b)
      .join();
    this.distances[target.id] = relativeDistance;
    target.distances[this.id] = relativeDistance;
  }

  /**
   * Searches through both beacons' relative distance lists and returns beacons, which have the same relative
   * distances to both. If the beacons compared from two scanners have the same distances to 11 other beacons,
   * it is an indicator of the two likely being one of the 12 beacons shared across signals.
   * @param {Beacon} target - Target Beacon to compare
   * @returns {BeaconIntersection[]} A list of found beacons
   */
  compare(target: Beacon): BeaconIntersection[] {
    const intersection = [];
    for (let indexInSelf = 0; indexInSelf < this.distances.length; indexInSelf++) {
      const relativeDistance = this.distances[indexInSelf];
      const indexInTarget = target.distances.indexOf(relativeDistance);
      if (indexInTarget > -1) {
        intersection.push({ indexInSelf, indexInTarget });
      }
    }
    return intersection;
  }
}

/** Class representing a single scanner and its detected beacons */
class Scanner {
  /** List of beacons detected by the scanner */
  beacons: Beacon[] = [];
  x: number = 0;
  y: number = 0;
  z: number = 0;

  /**
   * Adds a beacon signal to the scanner
   * @param {number} x - x coordinate of the beacon
   * @param {number} y - y coordinate of the beacon
   * @param {number} z - z coordinate of the beacon
   */
  addBeacon(x: number, y: number, z: number) {
    const newBeacon = new Beacon(x, y, z, this.beacons.length);
    for (let beacon of this.beacons) beacon.findRange(newBeacon);
    this.beacons.push(newBeacon);
  }

  /**
   * Finds the beacons shared between two scanners
   * @param {Scanner} target - Target Scanner to compare
   * @returns {ScannerIntersection | null} The first found beacon that's likely to be shared
   * between two scanners
   */
  compare(target: Scanner): ScannerIntersection | null {
    for (let targetBeacon of target.beacons) {
      for (let selfBeacon of this.beacons) {
        const intersections = targetBeacon.compare(selfBeacon);
        if (intersections.length >= 11) return { targetBeacon, selfBeacon, intersections };
      }
    }
    return null;
  }

  /**
   * Aligns the target beacon to this beacon
   * @param {Scanner} target - Target Scanner to compare
   * @param {ScannerIntersection} overlap - An overlap point between the two beacons
   */
  align(target: Scanner, overlap: ScannerIntersection) {
    for (let { indexInSelf, indexInTarget } of overlap.intersections) {
      const relativeSelf = this.beacons[indexInTarget];
      const dx0 = overlap.selfBeacon.x - relativeSelf.x;
      const dy0 = overlap.selfBeacon.y - relativeSelf.y;
      const dz0 = overlap.selfBeacon.z - relativeSelf.z;

      const relativeTarget = target.beacons[indexInSelf];
      const dx1 = overlap.targetBeacon.x - relativeTarget.x;
      const dy1 = overlap.targetBeacon.y - relativeTarget.y;
      const dz1 = overlap.targetBeacon.z - relativeTarget.z;

      const map = [];
      map[0] = dx0 === dx1 ? 1 : dx0 === -dx1 ? -1 : 0;
      map[1] = dx0 === dy1 ? 1 : dx0 === -dy1 ? -1 : 0;
      map[2] = dx0 === dz1 ? 1 : dx0 === -dz1 ? -1 : 0;
      map[3] = dy0 === dx1 ? 1 : dy0 === -dx1 ? -1 : 0;
      map[4] = dy0 === dy1 ? 1 : dy0 === -dy1 ? -1 : 0;
      map[5] = dy0 === dz1 ? 1 : dy0 === -dz1 ? -1 : 0;
      map[6] = dz0 === dx1 ? 1 : dz0 === -dx1 ? -1 : 0;
      map[7] = dz0 === dy1 ? 1 : dz0 === -dy1 ? -1 : 0;
      map[8] = dz0 === dz1 ? 1 : dz0 === -dz1 ? -1 : 0;

      for (let beacon of target.beacons) {
        const { x, y, z } = beacon;
        beacon.x = x * map[0] + y * map[1] + z * map[2];
        beacon.y = x * map[3] + y * map[4] + z * map[5];
        beacon.z = x * map[6] + y * map[7] + z * map[8];
      }
      target.x = overlap.selfBeacon.x - overlap.targetBeacon.x;
      target.y = overlap.selfBeacon.y - overlap.targetBeacon.y;
      target.z = overlap.selfBeacon.z - overlap.targetBeacon.z;
      for (let beacon of target.beacons) {
        beacon.x += target.x;
        beacon.y += target.y;
        beacon.z += target.z;
      }
      break;
    }
  }
}

// PART 1
const scanners = rawData.map((scanner) => {
  const newScanner = new Scanner();
  scanner.forEach(([x, y, z]) => newScanner.addBeacon(x, y, z));
  return newScanner;
});
const aligned = new Set([0]);
while (aligned.size < scanners.length) {
  for (let i = 0; i < scanners.length; i++) {
    for (let j = 0; j < scanners.length; j++) {
      if (i === j || !aligned.has(i) || aligned.has(j)) continue;
      let intersection = scanners[i].compare(scanners[j]);
      if (!intersection) continue;
      scanners[i].align(scanners[j], intersection);
      aligned.add(j);
    }
  }
}
const uniqueBeacons = new Set();
for (let scanner of scanners) {
  for (let beacon of scanner.beacons) {
    uniqueBeacons.add([beacon.x, beacon.y, beacon.z].join());
  }
}

// PART 2
const manhattan = (a: Scanner, b: Scanner) =>
  [a.x - b.x, a.y - b.y, a.z - b.z].map(Math.abs).reduce((sum, e) => sum + e, 0);
let maxDistance = 0;

for (let self of scanners) {
  for (let target of scanners) {
    const distance = manhattan(self, target);
    maxDistance = distance > maxDistance ? distance : maxDistance;
  }
}

// OUTPUTS
console.log(`Part 1: ${uniqueBeacons.size}`);
console.log(`Part 2: ${maxDistance}`);
