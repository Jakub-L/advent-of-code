const { findWinnerScore } = require('./utils');
const input = require('../../inputs/day-22.json');

function main() {
  const test = [
    [9, 2, 6, 3, 1],
    [5, 8, 4, 7, 10]
  ];

  console.log(findWinnerScore(...input, true));

  // console.log(`Part 1: ${findWinnerScore(...input)}`);
  // console.log(`Part 2: ${findWinnerScore(...input, true)}`);
}

main();
