const { sumMemory } = require('./utils');
const input = require('../../inputs/day-14.json');

function main() {
  console.log(`Part 1: ${sumMemory(input)}`);
  console.log(`Part 2: ${sumMemory(input, true)}`);
}

main();
