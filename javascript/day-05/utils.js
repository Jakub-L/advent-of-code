/**
 * Calculates the seat ID for a boarding pass string
 * @param {string} pass - Boarding pass string
 * @returns {number} The seat ID for a given boarding pass
 */
const seatID = (pass) => {
  const rules = {
    F: ([lRow, hRow], cols) => [[lRow, (hRow - lRow + 1) / 2 + lRow - 1], cols],
    B: ([lRow, hRow], cols) => [[(hRow - lRow + 1) / 2 + lRow, hRow], cols],
    R: (rows, [lCol, hCol]) => [rows, [(hCol - lCol + 1) / 2 + lCol, hCol]],
    L: (rows, [lCol, hCol]) => [rows, [lCol, (hCol - lCol + 1) / 2 + lCol - 1]]
  };

  let rows = [0, 127];
  let cols = [0, 7];

  for (let c of pass) {
    [rows, cols] = rules[c](rows, cols);
  }

  return 8 * rows[0] + cols[0];
};

/**
 * Finds the maximum seat ID for boarding passes
 * @param {string[]} passes - Array of boarding passes
 * @returns {number} Highest seat ID within array
 */
const maxSeatID = (passes) =>
  passes.reduce((max, pass) => {
    const id = seatID(pass);
    return id > max ? id : max;
  }, 0);

/**
 * Finds the seat ID missing from the array of passes
 * @param {string[]} passes - Array of boarding passes
 * @returns {number} Seat ID that's missing from the list
 */
const findMySeatID = (passes) => {
  return (
    passes
      .map(seatID)
      .sort((a, b) => a - b)
      .find((id, i, arr) => id + 1 !== arr[i + 1]) + 1
  );
};
module.exports = { maxSeatID, findMySeatID };
