/**
 * Returns first n numbers from an array that sum to a target number
 * @param {number[]} array - Array of numbers to search
 * @param {number} target - Number to which targets should sum
 * @param {number} n - How many numbers are supposed to make up the target number
 * @param {Object} numbersMemo - Memoized object of already-inspected numbers
 */
const findSum = (array, target, n, numbersMemo) => {
  // { ...undefined } is deeply equal to {}
  const dict = { ...numbersMemo };
  for (const e of array) {
    if (n > 2) {
      const subQuery = findSum(array.slice(1), target - e, n - 1, dict);
      if (subQuery.length === 0) {
        continue;
      } else {
        return [e, ...subQuery];
      }
    }

    if (n === 2) {
      if (dict[target - e]) return [e, target - e];
      dict[e] = e;
    } else if (n === 1 && e === target) {
      return [e];
    }
  }
  return [];
};

module.exports = { findSum };
