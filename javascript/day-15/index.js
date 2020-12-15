const { elfGame } = require('./utils');
const input = require('../../inputs/day-15.json');

function main() {
  console.log(`Part 1: ${elfGame(input, 2020)}`);
  console.log(`Part 2: ${elfGame(input, 30000000)}`);
}

main();
