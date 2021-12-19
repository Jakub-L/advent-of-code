/**
 * Solution to Day 18 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/18
 */
import { readInput } from '../utils';

// TYPES
type Element = Node | Leaf;
type Parent = Node | null;
type Snailfish = Array<number | Snailfish>;

// INPUTS
const snailfish = readInput('./../../inputs/day-17.txt');
const test = `[1,1]
[2,2]
[3,3]
[4,4]`
  .split('\n')
  .map((e) => JSON.parse(e));

// UTILS
/** Class representing a leaf node on the graph */
class Leaf {
  val: number;
  parent: Parent;

  /**
   * Creates a new leaf
   * @param {number} val - The number to be contained within the leaf
   */
  constructor(val: number) {
    /** The value in the node */
    this.val = val;
    /** The parent node */
    this.parent = null;
  }

  /**
   * Attempts to split the leaf into a node
   * @returns {boolean} True if split occured, false otherwise
   */
  split(): boolean {
    const { val, parent } = this;
    if (val >= 10) {
      const [left, right] = [new Leaf(Math.floor(val / 2)), new Leaf(Math.ceil(val / 2))];
      if (parent) {
        if (this.isRight) parent.right = new Node(left, right, parent);
        else parent.left = new Node(left, right, parent);
      }
      return true;
    }
    return false;
  }

  /**
   * Adds the values of two leaves together and stores it in the current leaf
   * @param {Leaf} leaf - The leaf to add to current leaf
   */
  add(leaf: Leaf) {
    this.val += leaf.val;
  }

  /**
   * Converts the leaf to a string representation
   * @returns {string} String form of the leaf's value
   */
  toString(): string {
    return this.val.toString();
  }

  /** Finds the depth of nesting of a given Leaf's parents */
  get depth(): number {
    return this.parent ? this.parent.depth : 0;
  }

  /** Is this leaf a right leaf on the parent */
  get isRight(): boolean {
    return this.parent !== null && this.parent.right === this;
  }

  /** Magnitude of a leaf node */
  get magnitude(): number {
    return this.val;
  }
}

/** Class representing a single node on the tree */
class Node {
  left: Element;
  right: Element;
  parent: Parent;

  /**
   * Create a new Node
   * @param {Element} left - Left node or leaf
   * @param {Element} right - Right node or leaf
   * @param {Parent} [parent] - Parent node
   */
  constructor(left: Element, right: Element, parent?: Parent) {
    this.left = left;
    this.left.parent = this;
    this.right = right;
    this.right.parent = this;
    this.parent = parent || null;
  }

  reduce() {
    let didExplode, didSplit;

    do {
      didSplit = this.split();
    } while (didSplit);
  }

  /**
   * Performs a single split of a snailfish number, preferring left splits
   * @returns {boolean} True if a split happened somewhere in the number
   */
  split(): boolean {
    const leftSplit = this.left.split();
    if (leftSplit) return true;
    else {
      const rightSplit = this.right.split();
      return rightSplit;
    }
  }

  /**
   * Performs a single explosion of a snailfish number, preferring left explosions
   * @returns {boolean} True if an explosion happened somewhere in the number
   */
  explode(): boolean {
    const { left, right, depth, parent, isRight } = this;
    if (left instanceof Leaf && right instanceof Leaf) {
      if (depth >= 4) {
        const leftNeighbour = this.findLeftNeighbour();
        const rightNeighbour = this.findRightNeighbour();
        if (leftNeighbour) leftNeighbour.add(left);
        if (rightNeighbour) rightNeighbour.add(right);
        if (parent) {
          if (isRight) parent.right = new Leaf(0);
          else parent.left = new Leaf(0);
        }
        return true;
      }
      return false;
    }
    if (left instanceof Node) {
      const leftExplode = left.explode();
      if (leftExplode) return true;
    }
    if (right instanceof Node) return right.explode();
    return false;
  }

  findLeftNeighbour(): Leaf | null {
    const { isRight, parent } = this;
    if (!isRight && parent) return parent.findLeftNeighbour();
    if (parent) {
      if (parent.left instanceof Leaf) return parent.left;
      return parent.left.rightmostLeaf;
    }
    return null;
  }

  findRightNeighbour(): Leaf | null {
    const { isRight, parent } = this;
    if (isRight && parent) return parent.findRightNeighbour();
    if (parent) {
      if (parent.right instanceof Leaf) return parent.right;
      return parent.right.leftmostLeaf;
    }
    return null;
  }

  /**
   * Converts a Node into a string representation
   * @returns {string} Representation of the node as a nested array string
   */
  toString(): string {
    return `[${this.left.toString()}, ${this.right.toString()}]`;
  }

  /** Depth of nesting of a given Node */
  get depth(): number {
    return this.parent ? this.parent.depth + 1 : 0;
  }

  /** Is this node a right node on the parent */
  get isRight(): boolean {
    return this.parent !== null && this.parent.right === this;
  }

  /** The furthest left leaf in the children of the Node */
  get leftmostLeaf(): Leaf {
    if (this.left instanceof Leaf) return this.left;
    else return this.left.leftmostLeaf;
  }

  /** The furthest left leaf in the children of the Node */
  get rightmostLeaf(): Leaf {
    if (this.right instanceof Leaf) return this.right;
    else return this.right.rightmostLeaf;
  }

  /** Magnitude of a Snailfish number contained within the Node */
  get magnitude(): number {
    return 3 * this.left.magnitude + 2 * this.right.magnitude;
  }
}

/**
 * Parses a snailfish number into a tree structure
 * @param {Snailfish} arr - Nested array of numbers representing a snailfish number
 * @returns {Node} The snailfish number in the form of a Node
 */
const parseSnailfish = (arr: Snailfish): Node => {
  const [left, right] = arr.map((elem) =>
    Array.isArray(elem) ? parseSnailfish(elem) : new Leaf(elem)
  );
  return new Node(left, right);
};

// const add = (a: Node, b: Node): Node => new Node(a, b).reduce();

// /**
//  * Recursively reduces a snailfish number by trying to explode it and then by trying
//  * to split it.
//  * @param {Snailfish} num - Snailfish number to reduce
//  * @returns {Snailfish} The reduced number
//  */
// const reduce = (num: Snailfish): Snailfish => {
//   let didExplode, didSplit, val;
//   // Try to explode the number. If exploded, reduce it again
//   ({ didExplode, val } = explode(num));
//   if (didExplode) return reduce(val);
//   // Try to spliut the number. If split, reduce it again
//   ({ didSplit, val } = split(num));
//   if (didSplit) return reduce(val);
//   // If neither exploded or split, return the number
//   return val;
// };

// PART 1

// PART 2

// OUTPUTS
let t = [
  [[[[[9, 8], 1], 2], 3], 4],
  [7, [6, [5, [4, [3, 2]]]]],
  [[6, [5, [4, [3, 2]]]], 1],
  [
    [3, [2, [1, [7, 3]]]],
    [6, [5, [4, [3, 2]]]],
  ],
  [
    [3, [2, [8, 0]]],
    [9, [5, [4, [3, 2]]]],
  ],
];

for (let sn of t) {
  let a = parseSnailfish(sn);
  console.log(a.toString());
  a.explode();
  console.log(a.toString());
  console.log('\n\n');
}

// console.log(`Part 1: ${}`);
// console.log(`Part 2: ${}`);
