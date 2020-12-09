const { findSum } = require('../global-utils');
/**
 * Finds the first number in data which isn't the sum of any two numbers in the previous N elements
 * @param {number[]} data - XMAS encoded data
 * @param {number=25} n - Length of array of previous elements in which to look for sum (also preamble length)
 * @returns {number} First number that can't be made up of sums, or null if all numbers can be made up
 */
const findInvalidNumber = (data, n = 25) => {
  for (let i = n; i < data.length; i += 1) {
    if (!findSum(data.slice(i - n, i), data[i], 2).length) {
      return data[i];
    }
  }
  return null;
};

/**
 * Finds the encryption weakness in the encoded data
 * @param {number[]} data - XMAS encoded data
 * @param {number} invalidNumber - Number that can't be made up of sums of N previous numbers
 * @returns {number} Product of minimum and maximum of contiguous set summing to invalidNumber
 */
const findEncryptionWeakness = (data, invalidNumber) => {
  const arr = [];
  let acc = 0;
  for (let i = 0; i < data.length; i += 1) {
    acc += data[i];
    arr.push(data[i]);
    while (acc > invalidNumber) {
      acc -= arr.shift();
    }
    if (acc === invalidNumber) {
      return Math.min(...arr) + Math.max(...arr);
    }
  }
};

module.exports = { findInvalidNumber, findEncryptionWeakness };
