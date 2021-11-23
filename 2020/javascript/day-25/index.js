const { findEncryptionKey } = require('./utils');
const [card, door] = require('../../inputs/day-25.json');

function main() {
  console.log(`Part 1: ${findEncryptionKey(card, door)}`);
  console.log(`Part 2: No part 2! Merry Christmas :)`);
}

main();
