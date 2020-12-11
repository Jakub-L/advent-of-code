/**
 * Counts the number of neighbouring (incl. diagonal) occupied seats
 * @param {string[]} plan - Floorplan of the waiting area
 * @param {number} seatX - Index of row of seat of interest
 * @param {number} seatY - Index of column of seat of interest
 * @param {number} maxDistance - Maximum distance to look for neighbours
 * @returns {number} Number of occupied seats surrounding seat of interest
 */
const countNeighbours = (plan, seatX, seatY, maxDistance) =>
  [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
  ].reduce((acc, [dX, dY]) => {
    for (let distance = 1; distance <= maxDistance; distance += 1) {
      const [x, y] = [seatX + distance * dX, seatY + distance * dY];
      const [maxX, maxY] = [plan.length, plan[x]?.length];
      if (x < 0 || x >= maxX || y < 0 || y >= maxY || plan[x][y] === 'L')
        return acc;
      if (plan[x][y] === '#') return acc + 1;
    }
    return acc;
  }, 0);

/**
 * Finds the number of seats occupied after it has stabilised
 * @param {string[]} initialPlan - Floorplan of the waiting area in initial arrangement
 * @param {number=1} maxDist - Maximum distance to look for neighbours
 * @param {number=3} maxNeigh - Maximum number of neighbours before the seat is vacated
 * @returns {number} count of occupied seats
 */
const findStablyOccupiedSeats = (initialPlan, maxDist = 1, maxNeigh = 3) => {
  const rules = {
    L: (plan, i, j) => (countNeighbours(plan, i, j, maxDist) === 0 ? '#' : 'L'),
    '#': (plan, i, j) =>
      countNeighbours(plan, i, j, maxDist) > maxNeigh ? 'L' : '#',
    '.': () => '.'
  };
  let area = {
    plan: initialPlan,
    changes: Infinity,
    occupied: 0
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
        occupied: 0
      }
    );
  }
  return area.occupied;
};

module.exports = { findStablyOccupiedSeats };
