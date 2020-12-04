const { countPassports, countValidPassports } = require('./utils');
const input = require('../../inputs/day-4.json');

function main() {
  console.log(`Part 1: ${countPassports(input)}`);
  console.log(`Part 2: ${countValidPassports(input)}`);
}

main();
