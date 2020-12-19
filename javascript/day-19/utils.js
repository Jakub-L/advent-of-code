/**
 * Converts rules into a dictionary
 * @param {string[]} rules - Array of rules in string form
 * @returns {Object} Dictionary of rules keyed by index
 */
const parseRules = (rules) =>
  rules.reduce((acc, r) => {
    const [id, rule] = r.split(': ');
    return { ...acc, [id]: rule };
  }, {});

/**
 * Finds a match string for a given starting rule
 * @param {string[]} rulesStrings - Array of rules in string form
 * @param {number} matchRule - Index of rules for which to find the regex
 * @param {boolean} partTwo - Whether part two of the challenge is being considered
 * @returns {string} Match string to satisfy given rules
 */
const getRegex = (rulesStrings, matchRule, partTwo) => {
  const rules = parseRules(rulesStrings);

  const iterate = (rule) => {
    if (partTwo) {
      // 8: 42 | 42 8 is equivalent to "one or more rule 42"
      if (rule === '8') return `(${iterate('42')}+)`;
      // 11: 42 31 | 42 11 31 is equivalent to "one or more rule 42 followed by the same number of rule 31"
      // Here I'm manually generating up to 5 of those
      if (rule === '11') {
        const [a, b] = [iterate('42'), iterate('31')];
        const opts = Array(5)
          .fill()
          .map((_, i) => `${a}{${i + 1}}${b}{${i + 1}}`)
          .join('|');
        return `(${opts})`;
      }
    }
    // Case 1: "a" or "b"
    if (/"."/.test(rule)) return rule.replaceAll('"', '');
    // Case 2: A single number
    if (/^\d+$/.test(rule)) return iterate(rules[rule]);
    // Case 3: Has an "or" pipe
    if (/\|/.test(rule))
      return `(${rule
        .split(' | ')
        .map((r) => iterate(r))
        .join('|')})`;
    // Case 4: Multiple numbers, no "or"
    return rule
      .split(' ')
      .map((r) => iterate(r))
      .join('');
  };
  return iterate(matchRule);
};

/**
 * Counts the number of strings matching the specified rule
 * @param {string[]} rules - Array of rules in string form
 * @param {string[]} strings - Array of strings to match against
 * @param {number=0} matchRule - Index of rules for which to find the regex
 * @param {boolean=false} partTwo - Whether part two of the challenge is being considered
 * @returns {number} Count of strings that match
 */
const countMatches = (rules, strings, matchRule = 0, partTwo = false) => {
  const matcher = new RegExp(`^${getRegex(rules, matchRule, partTwo)}$`);
  return strings.reduce((sum, str) => sum + matcher.test(str), 0);
};
module.exports = { countMatches };
