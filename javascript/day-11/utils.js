/**
 * Counts the number of neighbouring (incl. diagonal) occupied seats
 * @param {string[]} plan - Floorplan of the waiting area
 * @param {number} r - Index of row of seat of interest
 * @param {number} c - Index of column of seat of interest
 * @param {string="#"} char - Character defining what counts as "occupied seat"
 * @returns {number} Number of occupied seats surrounding seat of interest
 */
const countTakenNeighbours = (plan, r, c, char = '#') =>
  [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ].reduce((acc, [dR, dC]) => acc + (plan[r + dR]?.[c + dC] === char), 0);

/**
 * Finds the number of seats occupied after it has stabilised
 * @param {string[]} initialPlan - Floorplan of the waiting area in initial arrangement
 * @returns {number} count of occupied seats
 */
const findStablyOccupiedSeats = (initialPlan) => {
  const rules = {
    L: (plan, i, j) => (countTakenNeighbours(plan, i, j) === 0 ? '#' : 'L'),
    '#': (plan, i, j) => (countTakenNeighbours(plan, i, j) >= 4 ? 'L' : '#'),
    '.': () => '.',
  };
  let area = {
    plan: initialPlan,
    changes: Infinity,
    occupied: 0,
  };

  while (area.changes !== 0) {
    area = area.plan.reduce(
      (newArea, row, i, currPlan) => {
        let newRow = '';
        for (let j = 0; j < row.length; j += 1) {
          const newChar = rules[row[j]](currPlan, i, j);
          newArea.changes += newChar !== row[j];
          newArea.occupied += newChar === '#';
          newRow += newChar;
        }
        newArea.plan.push(newRow);
        return newArea;
      },
      {
        plan: [],
        changes: 0,
        occupied: 0,
      }
    );
  }
  return area.occupied;
};

module.exports = { findStablyOccupiedSeats };
