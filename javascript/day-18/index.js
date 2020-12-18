const { solve, solveAdditionFirst } = require('./utils');
const input = require('../../inputs/day-18.json');

function main() {
  console.log(`Part 1: ${input.reduce((acc, e) => acc + solve(e), 0)}`);
  console.log(
    `Part 2: ${input.reduce((acc, e) => acc + solveAdditionFirst(e, true), 0)}`
  );
}

main();
