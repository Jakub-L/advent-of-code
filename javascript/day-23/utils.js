/* eslint-disable prefer-destructuring */

//
// DEFINITIONS
//
/**
 * @typedef Cup
 * @description Node of a linked list
 * @param {number} value - Value of the node
 * @param {Cup|null} left - Left neighbouring node
 * @param {Cup|null} right - Right neighbouring node
 */

//
// FUNCTIONALITY
//
/** Cup, a node of of a linked list */
class Cup {
  constructor(value) {
    this.value = value;
    this.right = null;
    this.left = null;
  }
}

/**
 * Converts input string into array
 * @param {string} inputString - String defining the cup numberings
 * @returns {number[]} Cups as array of numbers
 */
const parseString = (inputString) => inputString.split('').map(Number);

/**
 * Converts cup input into a linked list dictionary, keyed by cup value
 * @param {string} input - String defining the cup numberings
 * @param {number} cupCount - How many cups should be in the game
 * @returns {Object.<number, Cup>} Dictionary of cups
 */
const getCups = (input, cupCount) => {
  const dict = {};
  const startCups = parseString(input);
  let prevCup = null;
  for (let i = 0; i < cupCount; i += 1) {
    const num = i < startCups.length ? startCups[i] : i + 1;
    const currCup = new Cup(num);
    dict[num] = currCup;

    if (prevCup) {
      prevCup.right = currCup;
      currCup.left = prevCup;
    }
    prevCup = currCup;
  }

  // Close the loop by linking first and last items
  dict[startCups[0]].left = prevCup;
  prevCup.right = dict[startCups[0]];
  return dict;
};

/**
 * Plays the crab cup game and finds final state
 * @param {string} input - String defining the cup numberings
 * @param {number} cupCount - How many cups should be in the game
 * @param {number} maxMoves - How many moves should the crab make
 * @returns {Object.<number, Cup>} Dictionary of cups with linkings as of _after_ last move
 */
const playGame = (input, cupCount, maxMoves) => {
  const cups = getCups(input, cupCount);
  const [min, max] = [1, cupCount];
  let currCup = cups[input[0]];

  for (let i = 0; i < maxMoves; i += 1) {
    // Get removed cup nodes
    const removed = [
      currCup.right,
      currCup.right.right,
      currCup.right.right.right
    ];

    // Repoint the list to avoid the removed elements
    currCup.right = removed[2].right;
    currCup.right.left = currCup;

    // Find destination
    let dest = currCup.value - 1 < min ? max : currCup.value - 1;
    while (removed.map((c) => c.value).includes(dest)) {
      dest = dest - 1 < min ? max : dest - 1;
    }

    // Get destination node and reinsert removed elements
    const destCup = cups[dest];
    removed[2].right = destCup.right;
    removed[2].right.left = removed[2];
    destCup.right = removed[0];
    destCup.right.left = destCup;

    // Move on to next cup
    currCup = currCup.right;
  }

  return cups;
};

/**
 * Finds the cup ordering after cup #1 after the game is completed
 * @param {string} input - String defining the cup numberings
 * @param {number=9} cupCount - How many cups should be in the game
 * @param {number=100} maxMoves - How many moves should the crab make
 * @returns {string} Cup ordering after cup labelled "1", joined
 */
const findCupLabels = (input, cupCount = 9, maxMoves = 100) => {
  const cups = playGame(input, cupCount, maxMoves);
  const labels = [];
  let currCup = cups['1'].right;
  while (currCup.value !== 1) {
    labels.push(currCup.value);
    currCup = currCup.right;
  }
  return labels.join('');
};

/**
 * Finds the product of cups with stars underneath them
 * @param {string} input - String defining the cup numberings
 * @param {number=1000000} cupCount - How many cups should be in the game
 * @param {number=10000000} maxMoves - How many moves should the crab make
 * @returns {number} Product of the labels of two cups immediately following Cup #1
 */
const findStarCupProduct = (input, cupCount = 1000000, maxMoves = 10000000) => {
  const cups = playGame(input, cupCount, maxMoves);
  const starCups = [cups[1].right, cups[1].right.right];
  return starCups.reduce((prod, cup) => prod * cup.value, 1);
};

module.exports = { findCupLabels, findStarCupProduct };
