/**
 * Finds the last value in the elf game
 * @param {string} start - Comma-separated numbers initiating the sequence
 * @param {number} endTurn - How many turns to run the sequence
 * @returns {number} The last number in the sequence
 */
const elfGame = (start, endTurn) => {
  const input = start.split(',').map(Number);
  const memory = new Map();
  let currNumber;

  for (let turn = 1; turn < endTurn; turn += 1) {
    const prevNumber = turn <= input.length ? input[turn - 1] : currNumber;
    currNumber = memory.has(prevNumber) ? turn - memory.get(prevNumber) : 0;
    memory.set(prevNumber, turn);
  }
  return currNumber;
};

module.exports = { elfGame };
