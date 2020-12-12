const {
  findManhattanDistance,
  findManhattanWaypointDistance
} = require('./utils');
const input = require('../../inputs/day-12.json');

function main() {
  console.log(`Part 1: ${findManhattanDistance(input)}`);
  console.log(`Part 2: ${findManhattanWaypointDistance(input)}`);
}

main();
