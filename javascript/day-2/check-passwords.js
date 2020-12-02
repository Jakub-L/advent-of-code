/**
 * Checks how many passwords fulfil their rules, assuming the rules define the number of times a letter must appear
 * @param {string[]} passwords - Array of strings of passwords and their rules, as per Day 2 definition
 * @returns {number} Count of passwords that match their individual rules
 */
const countPasswordsByNumber = (passwords) =>
  passwords.reduce((acc, passwordRow) => {
    const [min, max, char, pwd] = passwordRow.split(/[\s:-]+/);
    const matches = (pwd.match(new RegExp(char, 'g')) || []).length;
    return matches >= min && matches <= max ? acc + 1 : acc;
  }, 0);11:00 AM

/**
 * Checks how many passwords fulfil their rules, assuming the rules define only one position at which a letter must appear
 * @param {string[]} passwords - Array of strings of passwords and their rules, as per Day 2 definition
 * @returns {number} Count of passwords that match their individual rules
 */
const countPasswordsByPosition = (passwords) =>
  passwords.reduce((acc, passwordRow) => {
    const [indexA, indexB, char, pwd] = passwordRow.split(/[\s:-]+/);
    // A != B, where A and B are booleans is the equivalent of a logic XOR
    return (pwd[indexA - 1] === char) !== (pwd[indexB - 1] === char)
      ? acc + 1
      : acc;
  }, 0);

module.exports = {
  countPasswordsByNumber,
  countPasswordsByPosition,
};
