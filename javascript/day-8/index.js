const { cpu } = require('../global-utils');
const { fixIncorrectInstruction } = require('./utils');
const input = require('../../inputs/day-8.json');

function main() {
  console.log(`Part 1: ${cpu(input).accumulator}`);
  console.log(`Part 2: ${fixIncorrectInstruction(input)}`);
}

main();
