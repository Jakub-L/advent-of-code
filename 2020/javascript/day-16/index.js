const { findTicketErrorRate, multiplyDepartureFields } = require('./utils');
const input = require('../../inputs/day-16.json');

function main() {
  console.log(`Part 1: ${findTicketErrorRate(input)}`);
  console.log(`Part 2: ${multiplyDepartureFields(input)}`);
}

main();
