const { findJoltDiffs, findAdapterCombinations } = require('./utils');
const input = require('../../inputs/day-10.json');

function main() {
  // const p1 = findJoltDiffs(input)
  // console.log(`Part 1: ${p1[1] * p1[3]}`);

  // console.log(findAdapterCombinations(input));

  // console.log(findAdapterCombinations([
  //   28,
  //   33,
  //   18,
  //   42,
  //   31,
  //   14,
  //   46,
  //   20,
  //   48,
  //   47,
  //   24,
  //   23,
  //   49,
  //   45,
  //   19,
  //   38,
  //   39,
  //   11,
  //   1,
  //   32,
  //   25,
  //   35,
  //   8,
  //   17,
  //   7,
  //   9,
  //   4,
  //   2,
  //   34,
  //   10,
  //   3,
  // ]));
  console.log(findAdapterCombinations([16, 10, 15, 5, 1, 11, 7, 19, 6, 12, 4]));

  // console.log(`Part 2: ${findEncryptionWeakness(input, 57195069)}`);
}

main();
