/**
 * Converts the string input to an object of active fields
 * @param {string[]} initialStateStrings - Array of strings defining the initial state of the Conway cube
 * @param {boolean=false} fourD - Whether the result should be four dimensional
 * @returns {Object} Object with keys of "x,y,z,[w]" and value of "true" if position is active in the cube
 */
const parseInput = (initialStateStrings, fourD = false) =>
  initialStateStrings.reduce((acc, str, y) => {
    str.split('').forEach((char, x) => {
      if (char === '#') {
        if (fourD) acc[[x, y, 0, 0]] = true;
        else acc[[x, y, 0]] = true;
      }
    });
    return acc;
  }, {});

/**
 * Counts the number of neighbours of a point on the cube, truncating at 4
 * @param {Object} cube - Object with keys of "x,y,z" and value of "true" if position is active in the cube
 * @param {number} x - x-coordinate of point to inspect
 * @param {number} y - y-coordinate of point to inspect
 * @param {number} z - z-coordinate of point to inspect
 * @returns {number} The number of neighbours or 4, whichever is smaller
 */
const countUpToFourNeighbours = (cube, x, y, z) => {
  let count = 0;
  for (let i = -1; i <= 1; i += 1) {
    for (let j = -1; j <= 1; j += 1) {
      for (let k = -1; k <= 1; k += 1) {
        if (i === 0 && j === 0 && k === 0) continue;
        if (cube[[x - i, y - j, k - z]]) count += 1;
        if (count >= 4) return count;
      }
    }
  }
  return count;
};

/**
 * Counts the number of neighbours of a point on the cube, truncating at 4
 * @param {Object} cube - Object with keys of "x,y,z,w" and value of "true" if position is active in the cube
 * @param {number} x - x-coordinate of point to inspect
 * @param {number} y - y-coordinate of point to inspect
 * @param {number} z - z-coordinate of point to inspect
 * @param {number} w - w-coordinate of point to inspect
 * @returns {number} The number of neighbours or 4, whichever is smaller
 */
const countUpToFourNeighbours4d = (cube, x, y, z, w) => {
  let count = 0;
  for (let i = -1; i <= 1; i += 1) {
    for (let j = -1; j <= 1; j += 1) {
      for (let k = -1; k <= 1; k += 1) {
        for (let l = -1; l <= 1; l += 1) {
          if (i === 0 && j === 0 && k === 0 && l === 0) continue;
          if (cube[[x - i, y - j, k - z, l - w]]) count += 1;
          if (count >= 4) return count;
        }
      }
    }
  }
  return count;
};

/**
 * Finds the fields active in the next state of the cube
 * @param {Object} cube - Object with keys of "x,y,z" and value of "true" if position is active in the cube
 * @param {number} size - Size of the initial state space
 * @param {number} iter - Iteration of the cube progression
 * @returns {Object} Object with keys of "x,y,z" and value of "true" if position is active in the cube
 */
const iterateCube = (cube, size, iter) => {
  const newCube = {};
  for (let x = -iter; x < size + iter; x += 1) {
    for (let y = -iter; y < size + iter; y += 1) {
      for (let z = -iter; z <= iter; z += 1) {
        const neighbours = countUpToFourNeighbours(cube, x, y, z);
        const active = cube[[x, y, z]];
        if (
          (!active && neighbours === 3) ||
          (active && (neighbours === 3 || neighbours === 2))
        ) {
          newCube[[x, y, z]] = true;
        }
      }
    }
  }
  return newCube;
};

/**
 * Finds the fields active in the next state of the 4 dimensional hypercube
 * @param {Object} cube - Object with keys of "x,y,z,w" and value of "true" if position is active in the cube
 * @param {number} size - Size of the initial state space
 * @param {number} iter - Iteration of the cube progression
 * @returns {Object} Object with keys of "x,y,z,w" and value of "true" if position is active in the cube
 */
const iterateCube4d = (cube, size, iter) => {
  const newCube = {};
  for (let x = -iter; x < size + iter; x += 1) {
    for (let y = -iter; y < size + iter; y += 1) {
      for (let z = -iter; z <= iter; z += 1) {
        for (let w = -iter; w <= iter; w += 1) {
          const neighbours = countUpToFourNeighbours4d(cube, x, y, z, w);
          const active = cube[[x, y, z, w]];
          if (
            (!active && neighbours === 3) ||
            (active && (neighbours === 3 || neighbours === 2))
          ) {
            newCube[[x, y, z, w]] = true;
          }
        }
      }
    }
  }
  return newCube;
};

/**
 * Iterates the Conway cubes and finds the number of active fields
 * @param {string[]} input - Array of strings defining the initial state of the Conway cube
 * @param {number=6} endIter - Number of iterations to complete
 * @param {number=3} dim - Number of dimensions of the Conway cube
 * @returns {number} Count of active fields
 */
const countActiveFields = (input, endIter = 6, dim = 3) => {
  let cube = parseInput(input, dim === 4);
  for (let iter = 1; iter <= endIter; iter += 1) {
    if (dim === 3) cube = iterateCube(cube, input.length, iter);
    else if (dim === 4) cube = iterateCube4d(cube, input.length, iter);
  }
  return Object.keys(cube).length;
};

module.exports = { parseInput, countActiveFields };
