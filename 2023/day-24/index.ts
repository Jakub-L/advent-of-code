import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// UTILS
type Vector2 = { x: number; y: number };
type Vector3 = { x: number; y: number; z: number };
type NumRange = { min: number; max: number };
type CanonicalForm = { a: number; b: number; c: number };

class Hailstone {
  p: Vector3;
  v: Vector3;
  line2D: CanonicalForm;

  constructor(p: number[], v: number[]) {
    this.p = { x: p[0], y: p[1], z: p[2] };
    this.v = { x: v[0], y: v[1], z: v[2] };
    this.line2D = this._getLine2dEquation();
  }

  /**
   * Finds where two hailstones cross in 2d space (ignoring z-axis).
   *
   * @param {Hailstone} other - Other hailstone to check
   * @returns {Vector2 | null} The point of intersection between the two Hailstones
   */
  find2dIntersect(other: Hailstone): Vector2 | null {
    // Each ax + by + c = 0 line can be rearranged into the form y = mx + b where
    // m = -a / b. If both the lines' m values are equal, then they are parallel.
    //      -a1 / b1 = -a2 / b2
    //      -a1 * b2 = -a2 * b1
    //       a1 * b2 =  a2 * b1
    const { a: a1, b: b1, c: c1 } = this.line2D;
    const { a: a2, b: b2, c: c2 } = other.line2D;
    if (a1 * b2 === a2 * b1) return null;

    // To find the point of intersection, we can solve the system of equations
    //      a1 * x + b1 * y + c1 = 0
    //      a2 * x + b2 * y + c2 = 0
    // Rearranging the first equation for y:
    //      y = (-c1 - a1 * x) / b1
    // Substituting into the second equation:
    //      a2 * x + b2 * (-c1 - a1 * x) / b1 + c2 = 0
    //      a2 * x - (b2 * c1) / b1 - x * (b2 * a1) / b1 + c2 = 0
    //      x * (a2 - (b2 * a1) / b1) = (b2 * c1) / b1 - c2
    //      x (a2 * b1 - b2 * a1) = b2 * c1 - b1 * c2
    //      x = (b2 * c1 - b1 * c2) / (a2 * b1 - b2 * a1)
    // Substituting back into the first equation and simplifying:
    //      y = (a1 * c2 - a2 * c1) / (a2 * b1 - b2 * a1)
    const x = (b2 * c1 - b1 * c2) / (a2 * b1 - b2 * a1);
    const y = (a1 * c2 - a2 * c1) / (a2 * b1 - b2 * a1);

    // We need to check if the point of intersection would happen in the future
    // for both hailstones. To do this, we need to see that (x - p.x) has the
    // same sign as v.x and (y - p.y) has the same sign as v.y, for both hailstones.
    // If v.x is positive, then x - p.x should be positive. If v.x is negative,
    // then x - p.x should be negative. We can check this by seeing if the product
    // of the two values is positive (or zero).
    const inFuture = [this, other].every(h => (x - h.p.x) * h.v.x >= 0 && (y - h.p.y) * h.v.y >= 0);
    return inFuture ? { x, y } : null;
  }

  toString(): string {
    return `{ Hailstone: p = (${this.p.x}, ${this.p.y}, ${this.p.z}), v = (${this.v.x}, ${this.v.y}, ${this.v.z}) }`;
  }

  /**
   * Returns the 2d equation of the line that the Hailstone follows (ignoring z-axis)
   *
   * The hailstone's position is defined through its position [p.x, p.y] and velocity
   * [v.x, v.y] vectors. Any point [x, y] is on the line if and only if it satisfies
   * both these equations:
   *      x = p.x + v.x * t
   *      y = p.y + v.y * t
   * This holds true for any t. If we rearrange both equations for t, we get:
   *      t = (p.x - x) / v.x
   *      t = (p.y - y) / v.y
   * If we set both those equations equal to each other, we get:
   *      (p.x - x) / v.x = (p.y - y) / v.y
   *      (p.x - x) * v.y = (p.y - y) * v.x
   *      p.x * v.y - x * v.y = p.y * v.x - y * v.x
   *      -v.y * x + v.x + y + p.x * v.y - p.y * v.x = 0
   * Which can be rearranged into the form ax + by + c = 0.
   *
   * @returns {CanonicalForm} The line equation for the Hailstone's path in the form
   *      ax + by + c = 0.
   */
  private _getLine2dEquation(): CanonicalForm {
    const a = -this.v.y;
    const b = this.v.x;
    const c = this.v.y * this.p.x - this.v.x * this.p.y;
    return { a, b, c };
  }
}

const isInArea = (p: Vector2, x: NumRange, y: NumRange): boolean => {
  return p.x >= x.min && p.x <= x.max && p.y >= y.min && p.y <= y.max;
};

// INPUT PROCESSING
// const input = `19, 13, 30 @ -2,  1, -2
// 18, 19, 22 @ -1, -1, -2
// 20, 25, 34 @ -2, -2, -4
// 12, 31, 28 @ -1, -2, -1
// 20, 19, 15 @  1, -5, -3`
//   .split("\n")
//   .map(line => line.split(" @ ").map(s => s.split(", ").map(Number)));

const input = readFile(__dirname + "/input.txt", ["\n", " @ ", ", "], s => Number(s)) as unknown[][][] as number[][][];
const hailstones = input.map(([p, v]) => new Hailstone(p, v));
console.log(hailstones.map(h => h.toString()));

// PART 1
let intersections: number = 0;
const x = { min: 200000000000000, max: 400000000000000 };
const y = { min: 200000000000000, max: 400000000000000 };
for (let i = 0; i < hailstones.length; i++) {
  for (let j = i + 1; j < hailstones.length; j++) {
    const intersect = hailstones[i].find2dIntersect(hailstones[j]);
    if (intersect && isInArea(intersect, x, y)) intersections++;
  }
}

console.log(intersections);
