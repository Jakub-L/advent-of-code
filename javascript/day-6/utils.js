/**
 * Counts the number of unique questions to which _someone_ answered "yes"
 * @param {string[]} responses - Array of responses, one entry per person in group
 * @returns {number} Count of unique questions
 */
const countUniqueAnswers = (responses) => {
  const uniques = {};
  return responses.reduce((count, response) => {
    for (let char of response) {
      if (!uniques[char]) {
        uniques[char] = 1;
        count += 1;
      }
    }
    return count;
  }, 0);
};

/**
 * Counts the number of questions to which _everyone_ answered "yes"
 * @param {string[]} responses - Array of responses, one entry per person in group
 * @returns {number} Count of questions shared by everyone
 */
const countSharedAnswers = (responses) => {
  const uniques = {};
  return responses.reduce((count, response) => {
    for (let char of response) {
      if (uniques[char]) {
        uniques[char] += 1;
      } else {
        uniques[char] = 1;
      }
      count += uniques[char] === responses.length ? 1 : 0;
    }
    return count;
  }, 0);
};

/**
 * Counts the sum of all questions answered "yes" to across all forms
 * @param {string[][]} forms - Array of arrays representing responses to customs form
 * @param {function} counter - Function used for summing
 * @returns {number} Sum of counts
 */
const sumOfCounts = (forms, counter) =>
  forms.reduce((sum, form) => sum + counter(form), 0);

module.exports = { sumOfCounts, countUniqueAnswers, countSharedAnswers };
