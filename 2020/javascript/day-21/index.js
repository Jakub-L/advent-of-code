const { countNonAllergens, findCanonicalList } = require('./utils');
const input = require('../../inputs/day-21.json');

function main() {
  console.log(`Part 1: ${countNonAllergens(input)}`);
  console.log(`Part 2: ${findCanonicalList(input)}`);
}

main();
