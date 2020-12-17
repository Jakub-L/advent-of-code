const { countActiveFields } = require('./utils');
const input = require('../../inputs/day-17.json');

function main() {
  const testInput = ['.#.', '..#', '###'];

  console.log(`Part 1: ${countActiveFields(input, 6, 3)}`);
  console.log(`Part 2: ${countActiveFields(input, 6, 4)}`);
}

main();
