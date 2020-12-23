const { getLabelsAfterGame, getStarCups } = require('./utils');
const input = require('../../inputs/day-23.json');

function main() {
  const test = '389125467';
  console.log(getStarCups(test));
  // console.log(`Part 1: ${getLabelsAfterGame(input)}`);
  // console.log(`Part 2: ${}`);
}

main();
