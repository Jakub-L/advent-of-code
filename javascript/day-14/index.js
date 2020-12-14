const { sumMemory } = require('./utils');
const input = require('../../inputs/day-14.json');

function main() {
  const testInput = [
    'mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X',
    'mem[8] = 11',
    'mem[7] = 101',
    'mem[8] = 0',
  ];
  console.log(`Part 1: ${sumMemory(input)}`);
  //   console.log(`Part 2: ${findSubsequentTime(input)}`);
}

main();
