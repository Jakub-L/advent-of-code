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
 * @param {[ts: string, schedule: string]} busNotes - Puzzle-compliant input string. First element is the timestamp, the second is the bus schedule
 * @returns {number} Departure of first of the subsequent buses
 */
const findSubsequentTime = ([_, schedule]) => {
  const [firstBus, ...buses] = schedule
    .split(',')
    .reduce(
      (acc, bus, i) => (bus === 'x' ? acc : [...acc, { n: Number(bus), i }]),
      []
    );
  let increment = firstBus.n;
  return buses.reduce((t, { n, i }) => {
    while ((t + i) % n !== 0) t += increment;
    increment *= n;
    return t;
  }, firstBus.n);
};

module.exports = { findNextBus, findSubsequentTime };
