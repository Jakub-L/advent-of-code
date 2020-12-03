const {
  countPasswordsByNumber,
  countPasswordsByPosition,
} = require('./utils');
const input = require('../../inputs/day-2.json');

function main() {
  console.log(`Part 1: ${countPasswordsByNumber(input)}`);
  console.log(`Part 2: ${countPasswordsByPosition(input)}`);
}

main();
