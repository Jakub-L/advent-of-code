const { findNextBus, findSubsequentTime } = require('./utils');
const input = require('../../inputs/day-13.json');

function main() {
  const p1 = findNextBus(input);
  console.log(`Part 1: ${p1.wait * p1.bus}`);
  console.log(`Part 2: ${findSubsequentTime(input)}`);
}

main();
