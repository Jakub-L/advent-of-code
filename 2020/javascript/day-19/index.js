const { countMatches } = require('./utils');
const { rules, strings } = require('../../inputs/day-19.json');

function main() {
  console.log(`Part 1: ${countMatches(rules, strings)}`);
  console.log(`Part 2: ${countMatches(rules, strings, 0, true)}`);
}

main();
