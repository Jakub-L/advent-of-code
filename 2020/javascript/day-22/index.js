const { findWinnerScore } = require('./utils');
const input = require('../../inputs/day-22.json');

function main() {
  console.log(`Part 1: ${findWinnerScore(...input)}`);
  console.log(`Part 2: ${findWinnerScore(...input, true)}`);
}

main();
