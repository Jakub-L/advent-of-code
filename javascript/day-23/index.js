const { findCupLabels, findStarCupProduct } = require('./utils');
const input = require('../../inputs/day-23.json');

function main() {
  console.log(`Part 1: ${findCupLabels(input)}`);
  console.log(`Part 2: ${findStarCupProduct(input)}`);
}

main();
