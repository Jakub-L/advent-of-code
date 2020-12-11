/**
 * Counts the number of trees encountered on a toboggan slide down a slope
 * @param {string[]} slope - Array of strings defining positions of trees on slope
 * @param {number} dx - Number of steps taken horizontally with each movememnt (positive to the right)
 * @param {number} dy - Number of steps taken vertically with each movememnt (positive down slope)
 * @returns {number} Number of trees encountered along the slide down
 */
const countTrees = (slope, dx, dy) => {
  let count = 0;
  for (
    let row = 0, col = 0;
    row < slope.length;
    row += dy, col = (col + dx) % slope[0].length
  ) {
    if (slope[row][col] === '#') {
      count += 1;
    }
  }
  return count;
};

module.exports = { countTrees };
