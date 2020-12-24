const { countBlackTiles, countDailyTiles } = require('./utils');
const input = require('../../inputs/day-24.json');

function main() {
  console.log(`Part 1: ${countBlackTiles(input)}`);
  console.log(`Part 2: ${countDailyTiles(input)}`);
}

main();
