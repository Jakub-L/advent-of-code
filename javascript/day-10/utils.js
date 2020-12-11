/**
 * Finds the number of stepped differences when using all jolt adaptors
 * @param {number[]} jolts - Array of nominal joltages for each adapter
 * @returns {object} Object with keys representing joltage differences and values of their counts, null if can't use all adapters
 */
const findJoltDiffs = (jolts) => {
  const joltDict = jolts.reduce((dict, e) => ({ ...dict, [e]: true }), {});
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

/**
 * Finds the number of combinations of adapters with a depth-first tree traversal
 * @param {number[]} jolts - Array of nominal joltages for each adapter
 * @param {number=0} start - Number at which to start search, i.e. socket joltage
 * @param {number[]=[1,2,3]} joltRange - Possible joltage differences
 * @returns {number} Number of ways to reach the device's joltage
 */
const treeCombinations = (jolts, start = 0, joltRange = [1, 2, 3]) => {
  // mapped: true if all descendants have been explored
  // leaves: number of descendants with no children
  const tree = jolts.reduce(
    (acc, jolt) => ({ ...acc, [jolt]: { mapped: false, leaves: 0 } }),
    { [start]: { mapped: false, leaves: 0 } }
  );
  /**
   * Recursively finds the number of leaves for a joltage
   * @param {number} val - Current joltage being investigated
   * @returns {number} Number of leaves descending from 'val'
   */
  const recurseTree = (val) => {
    const children = joltRange.reduce(
      (acc, diff) => (val + diff in tree ? [...acc, val + diff] : acc),
      []
    );
    for (let i = 0; i < children.length; i += 1) {
      const child = children[i];
      if (tree[child].mapped) tree[val].leaves += tree[child].leaves;
      else tree[val].leaves += recurseTree(child);
    }
    tree[val] = { mapped: true, leaves: tree[val].leaves || 1 };
    return tree[val].leaves;
  };

  recurseTree(start);
  return tree[0].leaves;
};

/**
 * Finds the number of combinations of adapters with an array based approach
 * Heavily based on work by J. Stothard (https://github.com/jstothard)
 * @param {number[]} jolts - Array of nominal joltages for each adapter
 * @param {number[]=[1,2,3]} joltRange - Possible joltage differences
 * @returns {number} Number of ways to reach the device's joltage
 */
const arrayCombinations = (jolts, joltRange = [1, 2, 3]) => {
  const joltDict = jolts.reduce(
    (acc, jolt) => ({
      ...acc,
      [jolt]: true,
      deviceJoltage: Math.max(acc.deviceJoltage, jolt + 3),
    }),
    { deviceJoltage: 3 }
  );
  // routes[n] is the number of routes to reach joltage of n
  const routes = { 0: 1 };
  for (let i = 1; i <= joltDict.deviceJoltage; i += 1) {
    if (i in joltDict || i === joltDict.deviceJoltage) {
      routes[i] = joltRange.reduce(
        (sum, diff) => sum + (routes[i - diff] || 0),
        0
      );
    }
  }
  return routes[joltDict.deviceJoltage];
};

module.exports = { findJoltDiffs, treeCombinations, arrayCombinations };
