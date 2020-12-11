const { findStablyOccupiedSeats } = require('./utils');
const input = require('../../inputs/day-11.json');

function main() {
  // const testInput = [
  //   'L.LL.LL.LL',
  //   'LLLLLLL.LL',
  //   'L.L.L..L..',
  //   'LLLL.LL.LL',
  //   'L.LL.LL.LL',
  //   'L.LLLLL.LL',
  //   '..L.L.....',
  //   'LLLLLLLLLL',
  //   'L.LLLLLL.L',
  //   'L.LLLLL.LL',
  // ];
  // console.log(findStablyOccupiedSeats(testInput));
  console.log(`Part 1: ${findStablyOccupiedSeats(input)}`);
  // console.log(`Part 2:  ${}`);
}

main();
