/**
 * @typedef {Object} nextBus
 * @property {number} wait - The time to wait until the next bus
 * @property {number} bus - The number of the bus route
 */

/**
 * Finds the first bus to come after a given timestamp
 * @param {[ts: string, schedule: string]} busNotes - Puzzle-compliant input string. First element is the timestamp, the second is the bus schedule
 * @returns {nextBus} The next bus to come after timestamp
 */
const findNextBus = ([ts, schedule]) =>
  schedule
    .split(',')
    .map(Number)
    .reduce(
      (acc, bus) => {
        const wait = bus - (Number(ts) % bus);
        return wait < acc.wait ? { wait, bus } : acc;
      },
      { wait: Infinity }
    );

/**
 * Finds the first time for which buses come in subsequent times
 * Based on the Python 3.6 Chinese Remainder Theorem algorithm: https://rosettacode.org/wiki/Chinese_remainder_theorem#Python_3.6
 * @param {[ts: string, schedule: string]} busNotes - Puzzle-compliant input string. First element is the timestamp, the second is the bus schedule
 * @returns {number} Departure of first of the subsequent buses
 */
const findSubsequentTime = ([_, schedule]) => {
  const modularInverse = (a, b) => {
    const b0 = b;
    let [x0, x1, q] = [0, 1, Math.floor(a / b)];
    while (a > 1) {
      q = Math.floor(a / b);
      [a, b] = [b, a % b];
      [x0, x1] = [x1 - q * x0, x0];
    }
    return x1 < 0 ? x1 + b0 : x1;
  };
  const chineseRemainder = (mods, vals) => {
    const prod = mods.reduce((acc, mod) => acc * mod);
    const sum = mods.reduce((acc, mod, i) => {
      const p = Math.floor(prod / mod);
      return acc + vals[i] * modularInverse(p, mod) * p;
    }, 0);
    return sum % prod;
  };

  const parsedSchedule = schedule.split(',').reduce(
    (acc, bus, i) => {
      console.log(bus, i);
      if (bus === 'x') return acc;
      const freq = Number(bus);
      const remainder = i ? freq - i : 0;
      return {
        mods: [...acc.mods, freq],
        vals: [...acc.vals, remainder]
      };
    },
    { mods: [], vals: [] }
  );

  console.log(parsedSchedule.mods, parsedSchedule.vals);
  return chineseRemainder(parsedSchedule.mods, parsedSchedule.vals);
};

module.exports = { findNextBus, findSubsequentTime };
