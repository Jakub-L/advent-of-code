/**
 * Solution to Day 13 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/13
 */
import { readInput } from '../utils';

// INPUTS
// const signals: string[] = readInput('./day-13/input.txt', '\n\n');
const signals: Packet[][] = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`
  .split('\n\n')
  .map(pair => pair.split('\n').map(str => JSON.parse(str)));

// UTILS
type Packet = Array<number | Packet>;

const toArrayIfNeeded = (elem: number | Packet): number[] | Packet =>
  typeof elem === 'number' ? [elem] : elem;

// PART 1
const isInRightOrder = (pair: Packet[]): boolean | null => {
  const compareElements = (a: number | Packet, b: number | Packet): boolean | null => {
    if (typeof a === 'number' && typeof b === 'number') {
      if (a === b) return null;
      return a < b;
    }
    return isInRightOrder([toArrayIfNeeded(a), toArrayIfNeeded(b)]);
  };

  const [first, second] = pair;
  for (let i = 0; i < Math.min(first.length, second.length); i++) {
    const result = compareElements(first[i], second[i]);
    if (result === null) continue;
    return result;
  }
  return first.length < second.length; // If left side ran out first, inputs are in the right order
};

console.log(
  isInRightOrder([
    [[1], [2, 3, 4]],
    [[1], 4]
  ])
);
