const { findStablyOccupiedSeats } = require('./utils');
const input = require('../../inputs/day-11.json');

function main() {
  console.log(`Part 1: ${findStablyOccupiedSeats(input)}`);
  console.log(`Part 2: ${findStablyOccupiedSeats(input, Infinity, 4)}`);
}

main();
