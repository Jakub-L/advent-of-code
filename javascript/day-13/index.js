const { findNextBus, findSubsequentTime } = require('./utils');
const input = require('../../inputs/day-13.json');

function main() {
  // const p1 = findNextBus(input);
  // console.log(`Part 1: ${p1.wait * p1.bus}`);
  // console.log(`Part 2: ${findSubsequentTime(input)}`);
  // console.log(findSubsequentTime(['', '17,x,13,19']));
  // console.log(findSubsequentTime(['', '67,7,59,61']));
  // console.log(findSubsequentTime(['', '67,x,7,59,61']));
  // console.log(findSubsequentTime(['', '1789,37,47,1889']));
  console.log(findSubsequentTime(input));
}

main();
