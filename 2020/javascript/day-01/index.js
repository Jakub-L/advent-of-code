const { findSum } = require('../global-utils');
const input = require('../../inputs/day-01.json');

function main() {
  const p1 = findSum(input, 2020, 2);
  const p2 = findSum(input, 2020, 3);
  console.log(`Part 1: ${p1.join(' * ')} = ${p1.reduce((acc, e) => acc * e)}`);
  console.log(`Part 2: ${p2.join(' * ')} = ${p2.reduce((acc, e) => acc * e)}`);
}

main();
