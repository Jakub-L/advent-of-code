const { countContainingBags, countContainedBags } = require('./utils');
const input = require('../../inputs/day-07.json');

function main() {
  console.log(`Part 1: ${countContainingBags('shiny gold', input)}`);
  console.log(`Part 2: ${countContainedBags('shiny gold', input)}`);
}

main();
