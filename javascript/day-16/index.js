const { findTicketErrorRate } = require('./utils');
const input = require('../../inputs/day-16.json');

function main() {
  // const testInput = {
  //   fields: ['class: 1-3 or 5-7', 'row: 6-11 or 33-44', 'seat: 13-40 or 45-50'],
  //   yourTicket: '7,1,14',
  //   nearbyTickets: ['7,3,47', '40,4,50', '55,2,20', '38,6,12'],
  // };

  // console.log(findTicketErrorRate(testInput.fields, testInput.nearbyTickets));

  
  console.log(`Part 1: ${findTicketErrorRate(input.fields, input.nearbyTickets)}`);
  // console.log(`Part 2: ${}`);
}

main();
