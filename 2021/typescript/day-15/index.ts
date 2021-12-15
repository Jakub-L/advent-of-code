/**
 * Solution to Day 15 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/15
 */
import { readInput } from '../utils';

// INPUTS
const test = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`
  .split('\n')
  .map((row) => row.split('').map(Number));

const input = readInput('./../../inputs/day-15.txt').map((row) =>
  row.split('').map(Number)
);

// UTILS
const findDistance = (risks: number[][]) => {
  const distances = Array(risks.length)
    .fill(null)
    .map((row, i) => Array(risks[i].length).fill(null));
  for (let i = risks.length - 1; i >= 0; i--) {
    for (let j = risks[i].length - 1; j >= 0; j--) {
      const [down, right] = [distances[i + 1]?.[j], distances[i]?.[j + 1]];
      let dist;
      if (down && right) dist = Math.min(down, right);
      else if (down) dist = down;
      else if (right) dist = right;
      else dist = 0;
      distances[i][j] = dist + risks[i][j];
    }
  }
  return distances;
};

// PART 1

// PART 2

// OUTPUTS
console.log(findDistance(input)[0][0] - input[0][0]);
// console.log(`Part 1: ${}`);
// console.log(`Part 2: ${}`);

// 1163751742 2274862853 3385973964 4496184175 5517195186
// 1163751742 2274862853 3385973964 4496184175 5517295286
