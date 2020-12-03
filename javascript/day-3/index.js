const { countTrees } = require('./tree-counter');
const input = require('../../inputs/day-3.json');

function main() {
  console.log(`Part 1: ${countTrees(input, 3, 1)}`);

  const p2 = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ];
  console.log(
    `Part 2: ${p2.reduce(
      (acc, [ dx, dy ]) => acc * countTrees(input, dx, dy),
      1
    )}`
  );
}

main();
