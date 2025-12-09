import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { union } from "@jakub-l/aoc-lib/collections";
import { prod } from "@jakub-l/aoc-lib/math";

// Types
type Point = { x: number; y: number };
type Edge = [Point, Point];

// Input
const input: Point[] = readFile(__dirname + "/input.txt", ["\n"], stringToPoint);
const testInput: Point[] = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`
  .split("\n")
  .map(stringToPoint);

/**
 * Parses a string coordinate into a Point object.
 * @param str - The string representation of the coordinate.
 * @returns The parsed Point object.
 */
function stringToPoint(str: string): Point {
  const [x, y] = str.split(",").map(Number);
  return { x, y };
}

// Part 1 & 2
/** Represents a polygon defined by a set of vertices. */
class Polygon {
  vertices: Point[];
  edges: Edge[] = [];

  /**
   * Creates a new Polygon instance.
   * @param vertices - The vertices of the polygon.
   */
  constructor(vertices: Point[]) {
    this.vertices = vertices;
    for (let i = 0; i < vertices.length; i++) {
      this.edges.push([vertices[i], vertices[(i + 1) % vertices.length]]);
    }
  }

  /**
   * Calculates the area of the largest rectangle that can be formed using any two vertices of the polygon.
   * Optionally constrains the rectangle to be strictly inside the polygon.
   * @param constrained Whether the rectangle must be contained within the polygon.
   * @returns The area of the largest rectangle.
   */
  public largestRectangleArea(constrained: boolean = false) {
    let maxArea = 0;
    for (let i = 0; i < this.vertices.length - 1; i++) {
      for (let j = i + 1; j < this.vertices.length; j++) {
        const [pA, pB] = [this.vertices[i], this.vertices[j]];
        const area = this._rectArea(pA, pB);
        if (area <= maxArea) continue;
        if (constrained && !this._isRectInPolygon(pA, pB)) continue;
        maxArea = area;
      }
    }
    return maxArea;
  }

  /**
   * Calculates the other two vertices of an axis-aligned rectangle given two opposite corners.
   * @param pA One corner of the rectangle.
   * @param pB The opposite corner of the rectangle.
   * @returns The two calculated vertices.
   */
  private _rectVertices(pA: Point, pB: Point) {
    const [pC, pD] = [
      { x: pA.x, y: pB.y },
      { x: pB.x, y: pA.y }
    ];
    return [pC, pD];
  }

  /**
   * Checks if a point lies on a line segment.
   * Uses the cross product to check for collinearity and bounds checking for the segment.
   * @param p The point to check.
   * @param edge The line segment defined by two points.
   * @returns True if the point is on the segment, false otherwise.
   */
  private _isPointOnSegment(p: Point, [pA, pB]: Edge) {
    const cross = (pB.x - pA.x) * (p.y - pA.y) - (pB.y - pA.y) * (p.x - pA.x);
    if (Math.abs(cross) > 0) return false;
    if (p.x < Math.min(pA.x, pB.x) || p.x > Math.max(pA.x, pB.x)) return false;
    if (p.y < Math.min(pA.y, pB.y) || p.y > Math.max(pA.y, pB.y)) return false;
    return true;
  }

  /**
   * Determines if a point is inside the polygon using the Ray Casting algorithm.
   * Counts how many times a horizontal ray starting from the point intersects the polygon edges.
   * An odd number of intersections means the point is inside.
   * @param p The point to check.
   * @returns True if the point is inside the polygon, false otherwise.
   */
  private _isPointInPolygon(p: Point) {
    let inside = false;
    for (const edge of this.edges) {
      if (this._isPointOnSegment(p, edge)) return true;
      const [start, end] = edge;
      if (start.y > p.y !== end.y > p.y) {
        const x_intersect =
          ((end.x - start.x) * (p.y - start.y)) / (end.y - start.y) + start.x;
        if (p.x < x_intersect) inside = !inside;
      }
    }
    return inside;
  }

  /**
   * Checks if two line segments intersect.
   * Uses orientation of ordered triplets to determine intersection.
   * Two segments (p1,q1) and (p2,q2) intersect if and only if:
   * 1. (p1, q1, p2) and (p1, q1, q2) have different orientations.
   * 2. (p2, q2, p1) and (p2, q2, q1) have different orientations.
   * @param edge1 - The first line segment.
   * @param edge2 - The second line segment.
   * @returns True if the segments intersect, false otherwise.
   */
  private _isSegmentsIntesect([pA, pB]: Edge, [qA, qB]: Edge) {
    const orientation1 = this._orientation(pA, pB, qA);
    const orientation2 = this._orientation(pA, pB, qB);
    const orientation3 = this._orientation(qA, qB, pA);
    const orientation4 = this._orientation(qA, qB, pB);
    return orientation1 * orientation2 < 0 && orientation3 * orientation4 < 0;
  }

  /**
   * Checks if a rectangle defined by two opposite corners is strictly contained within the polygon.
   * A rectangle is in the polygon if all its vertices are inside and none of its edges intersect with the polygon's edges.
   * @param pA One corner of the rectangle.
   * @param pB The opposite corner of the rectangle.
   * @returns True if the rectangle is inside the polygon.
   */
  private _isRectInPolygon(pA: Point, pB: Point) {
    const vertices = this._rectVertices(pA, pB);

    for (const vertex of vertices) {
      if (!this._isPointInPolygon(vertex)) return false;
    }

    const [pC, pD] = vertices;
    const rectEdges: Edge[] = [
      [pA, pC],
      [pC, pB],
      [pB, pD],
      [pD, pA]
    ];

    for (const rectEdge of rectEdges) {
      for (const edge of this.edges) {
        if (this._isSegmentsIntesect(rectEdge, edge)) return false;
      }
    }

    return true;
  }

  /**
   * Determines the orientation of the ordered triplet (p, q, r).
   * This concept is used to find the "turn" direction when moving from p to q to r.
   * It calculates the z-component of the cross product of the vectors pq and pr.
   *
   * The return value indicates:
   * 0: p, q, and r are collinear.
   * 1: Clockwise (or Counter-Clockwise, depending on the coordinate system).
   * -1: Counter-Clockwise (or Clockwise).
   *
   * For the purpose of segment intersection, we primarily care if two points lie on
   * opposite sides of a line (indicated by different signs).
   *
   * @param p First point.
   * @param q Second point.
   * @param r Third point.
   * @returns 0 if collinear, 1 or -1 for different orientations.
   */
  private _orientation(p: Point, q: Point, r: Point) {
    const val = (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
    if (val === 0) return 0;
    return val > 0 ? 1 : -1;
  }

  /**
   * Calculates the area of an axis-aligned rectangle defined by two points.
   * The calculation includes the boundary, treating points as integer coordinates.
   * Area = (width + 1) * (height + 1).
   * @param pA - One corner.
   * @param pB - Opposite corner.
   * @returns The area (number of integer points) of the rectangle.
   */
  private _rectArea(pA: Point, pB: Point) {
    return (Math.abs(pA.x - pB.x) + 1) * (Math.abs(pA.y - pB.y) + 1);
  }
}

// Results
const polygon = new Polygon(input);
console.log(`Part 1: ${polygon.largestRectangleArea()}`);
console.log(`Part 2: ${polygon.largestRectangleArea(true)}`);
