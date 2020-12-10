/**
 * Converts unsorted array of adapter joltages to index object
 * @param {number[]} jolts - Array of nominal joltages for each adapter
 * @returns {object} Quick reference index for adapters, with value indicating whether node has been visited
 */
const makeJoltDict = (jolts) =>
  jolts.reduce((dict, e) => ({ ...dict, [e]: false }), {});

/**
 * Finds the number of stepped differences when using all jolt adaptors
 * @param {number[]} jolts - Array of nominal joltages for each adapter
 * @returns {object} Object with keys representing joltage differences and values of their counts, null if can't use all adapters
 */
const findJoltDiffs = (jolts) => {
  const joltDict = makeJoltDict(jolts);
  // Last diff accounts for the step from adapter to device
  const differences = { 1: 0, 2: 0, 3: 1 };
  let currentJolt = 0;

  for (let i = 0; i < jolts.length; i += 1) {
    for (let difference = 1; difference <= 3; difference += 1) {
      if (currentJolt + difference in joltDict) {
        differences[difference] += 1;
        currentJolt += difference;
        break;
      }
    }
  }
  return differences;
};

const findAdapterCombinations = (jolts, startVal = 0) => {
  const index = makeJoltDict(jolts);
  let count = 0;

  const recurseTree = (currVal) => {
    const children = [1, 2, 3].reduce(
      (acc, diff) => (currVal + diff in index ? [...acc, currVal + diff] : acc),
      []
    );
    if (!children.length) {
      // No children (end of tree)
      count += 1;
    } else {
      children.forEach((child) => recurseTree(child));
    }
  };

  recurseTree(startVal);
  return count;
};

module.exports = { findJoltDiffs, findAdapterCombinations };
