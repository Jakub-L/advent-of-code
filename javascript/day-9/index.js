const { findInvalidNumber, findEncryptionWeakness } = require('./utils');
const input = require('../../inputs/day-9.json');

function main() {
  console.log(`Part 1: ${findInvalidNumber(input, 25)}`);
  console.log(`Part 2: ${findEncryptionWeakness(input, 57195069)}`);
}

main();
