/**
 * Solution to Day 18 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/18
 */
import { readInput } from '../utils';

// TYPES
type Element = Pair | number;
type NestedArray = Array<number | NestedArray>;

// INPUTS
const snailfish = readInput('./../../inputs/day-17.txt');
const test = `[1,1]
[2,2]
[3,3]
[4,4]`
  .split('\n')
  .map((e) => JSON.parse(e));

// UTILS
class Pair {
  left: Element;
  right: Element;
  parent: Pair | null;
  nesting: number;

  constructor(left: Element, right: Element, parent?: Pair) {
    this.left = left;
    this.right = right;
    this.parent = parent || null;
    this.nesting = parent ? parent.nesting + 1 : 0;
    this.setParent();
    this.increaseNesting();
  }

  increaseNesting() {
    if (this.left instanceof Pair) {
      (this.left as Pair).nesting += 1;
      if (this.left.nesting === 4) this.left.explode();
      else (this.left as Pair).increaseNesting();
    }
    if (this.right instanceof Pair) {
      (this.right as Pair).nesting += 1;
      if (this.right.nesting === 4) this.right.explode();
      else (this.right as Pair).increaseNesting();
    }
  }

  setParent() {
    if (this.left instanceof Pair) this.left.parent = this;
    if (this.right instanceof Pair) this.right.parent = this;
  }

  explode() {
    let lTarget = this.parent;
    let rTarget = this.parent;
    while (lTarget instanceof Pair && lTarget.left instanceof Pair)
      lTarget = lTarget.parent as Pair;
    while (rTarget instanceof Pair && rTarget.right instanceof Pair) {
      rTarget = rTarget.parent as Pair;
    }
    if (lTarget) (lTarget.left as number) += this.left as number;
    if (rTarget) (rTarget.right as number) += this.right as number;
    if (this.parent?.left === this) this.parent.left = 0;
    else if (this.parent?.right === this) this.parent.right = 0;
  }

  split() {}

  toString(): string {
    return `[${this.left instanceof Pair ? this.left.toString() : this.left}, ${
      this.right instanceof Pair ? this.right.toString() : this.right
    }]`;
  }
}

const parseSnailfish = (arr: NestedArray): Pair => {
  const [left, right] = arr;
  let leftElement, rightElement;
  if (Array.isArray(left)) {
    leftElement = parseSnailfish(left);
  }
  if (Array.isArray(right)) {
    rightElement = parseSnailfish(right);
  }
  return new Pair(
    leftElement || (left as number),
    rightElement || (right as number)
  );
};

const add = (a: Pair, b: Pair): Pair => new Pair(a, b);

// PART 1

// PART 2

// OUTPUTS
const a = parseSnailfish([
  [3, [2, [1, [7, 3]]]],
  [6, [5, [4, [3, 2]]]],
]);
console.log(a.toString());
// console.log(`Part 1: ${}`);
// console.log(`Part 2: ${}`);
