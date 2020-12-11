const { maxSeatID, findMySeatID } = require('./utils');
const input = require('../../inputs/day-05.json');

function main() {
  console.log(`Part 1: ${maxSeatID(input)}`);
  console.log(`Part 2: ${findMySeatID(input)}`);
}

main();
