const {
  sumOfCounts,
  countUniqueAnswers,
  countSharedAnswers
} = require('./utils');
const input = require('../../inputs/day-6.json');

function main() {
  console.log(`Part 1: ${sumOfCounts(input, countUniqueAnswers)}`);
  console.log(`Part 2: ${sumOfCounts(input, countSharedAnswers)}`);
}

main();
