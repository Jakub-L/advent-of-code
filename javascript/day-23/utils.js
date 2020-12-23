/**
 * Converts input string into array
 * @param {string} inputString - String defining the cup numberings
 * @returns {number[]} Cups as array of numbers
 */
const parseString = (inputString) => inputString.split('').map(Number);

/**
 * Performs a single iteration of the crab game
 * @param {number[]} cups - Array of cups
 * @param {number} i - Cup index to look at
 * @param {number} min - Minimum number on any of the cups
 * @param {number} max - Maximum number on any of the cups
 * @returns {number[]} Cup arrangement after the move
 */
const move = (cups, i, min, max) => {
  const [newCups, num] = [[...cups], cups[i]];
  // Take out three cups immediately following the indexed cup
  let rem = newCups.splice(i + 1, 3);
  if (rem.length !== 3) rem = [...rem, ...newCups.splice(0, 3 - rem.length)];

  // Find destination value
  let dest = cups[i] - 1 < min ? max : cups[i] - 1;
  while (rem.includes(dest)) dest = dest - 1 < min ? max : dest - 1;

  // Replace the cups and reorder array so the initial number is at same index
  newCups.splice(newCups.indexOf(dest) + 1, 0, ...rem);
  while (newCups[i] !== num) newCups.unshift(newCups.pop());
  return newCups;
};

/**
 * Plays the crab game
 * @param {string} input - String defining the initial cup numberings
 * @param {number} maxMoves - Number of moves for the game to complete
 * @returns {number[]} Cup arrangement after the specified number of moves
 */
const playGame = (input, maxMoves) => {
  let cups = parseString(input);
  const [minCup, maxCup] = [Math.min(...cups), Math.max(...cups)];
  for (let i = 0; i < maxMoves; i += 1) {
    cups = move(cups, i % cups.length, minCup, maxCup);
  }
  return cups;
};

/**
 * Finds the labels of cups in a final orientation
 * @param {string} input - String defining the initial cup numberings
 * @param {number} maxMoves - Number of moves for the game to complete
 * @returns {string} Order of cups after cup #1
 */
const getLabelsAfterGame = (input, maxMoves = 100) => {
  const cups = playGame(input, maxMoves);
  while (cups[0] !== 1) cups.unshift(cups.pop());
  return cups.slice(1).join('');
};

module.exports = { getLabelsAfterGame };
