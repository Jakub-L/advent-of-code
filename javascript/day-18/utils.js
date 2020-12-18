/* eslint-disable no-cond-assign */
/* eslint-disable no-eval */

/**
 * Solves the equation assuming equal precedence of addition and multiplication
 * @param {string} eqn - Equation to solve
 * @returns {number} Value of solved equation
 */
const solve = (eqn) => {
  // Trim starting/ending parenthesis if there are no other parens
  if (/^\([^()]*\)$/.test(eqn)) eqn = eqn.replaceAll(/^\(|\)$/g, '');
  // Work through equations in parenthesis from the inside out
  while (/\([^()]*\)/.test(eqn)) {
    eqn = eqn.replace(/\([^()]*\)/, solve);
  }
  // Evaluate remaining equation left to right
  let match;
  while ((match = eqn.match(/\d+ (?:\+|\*) \d+/)?.[0])) {
    eqn = eqn.replace(match, eval);
  }
  return Number(eqn);
};

/**
 * Solves the equation assuming addition before multiplication (using a operator-precedence parser)
 * @param {string} eqn - Equation to solve
 * @returns {number} Value of solved equation
 */
const solveAdditionFirst = (eqn) =>
  eval(
    `((${eqn
      .replace(/\(/g, '(((')
      .replace(/\)/g, ')))')
      .replace(/\+/g, ')+(')
      .replace(/\*/g, '))*((')}))`
  );

module.exports = { solve, solveAdditionFirst };
