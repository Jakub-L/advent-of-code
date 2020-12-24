//
// TYPE DEFINITIONS
//

/**
 * @typedef TileObject
 * @param {Set.<string>} blackTiles - Set of all tile coordinates that are currently black
 * @param {number} maxCoord - Maximum absolute value of any of the tile's coordinates
 */

//
// FUNCTIONALITY
//
/**
 * Converts the directions to a tile's coordinates
 * @param {string} directions - A string defining the steps to get to the tile
 * @returns {Array.<number>} Coordinates of the point, on the w-e axis and sw-ne axis
 */
const getCoords = (directions) => {
  const rules = {
    se: ([x, y]) => [x + 1, y - 1],
    sw: ([x, y]) => [x, y - 1],
    ne: ([x, y]) => [x, y + 1],
    nw: ([x, y]) => [x - 1, y + 1],
    w: ([x, y]) => [x - 1, y],
    e: ([x, y]) => [x + 1, y]
  };
  return directions
    .match(/se|sw|ne|nw|w|e/g)
    .reduce((point, dir) => rules[dir](point), [0, 0]);
};

/**
 * Converts the input strings to a set of coordinates of black tiles
 * @param {Array.<string>} tiles - An array of strings defining steps to get to each tile
 * @returns {TileObject} Object of tiles
 */
const getBlackTiles = (tiles) =>
  tiles.reduce(
    (acc, tile) => {
      const coords = getCoords(tile);
      const key = coords.toString();
      // If tile was black, remove it. If it was white, delete returns false, so add it to now-black tiles
      if (!acc.blackTiles.delete(key)) acc.blackTiles.add(key);
      return {
        ...acc,
        maxCoord: Math.max(
          acc.maxCoord,
          Math.abs(coords[0]),
          Math.abs(coords[1])
        )
      };
    },
    { blackTiles: new Set(), maxCoord: 0 }
  );

/**
 * Counts the number of tiles flipped to black
 * @param {Array.<string>} tiles - An array of strings defining steps to get to each tile
 * @returns {number} Count of tiles which are flipped to black by the end of instructions
 */
const countBlackTiles = (tiles) => getBlackTiles(tiles).blackTiles.size;

/**
 * Count of neighbouring tiles, which are black
 * @param {Array.<number>} tile - Coordinates of the tile inspected
 * @param {Set.<string>} blackTiles - Set of all tiles that are currently black
 * @returns {number} Count of neighbouring tiles that are black
 */
const countBlackNeighbours = ([x, y], blackTiles) =>
  [
    [0, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, 0],
    [-1, 1]
  ].reduce(
    (count, [dx, dy]) => count + blackTiles.has([x + dx, y + dy].toString()),
    0
  );

/**
 * Counts the number of black tiles after a certain number of days at the exhibit
 * @param {Array.<string>} tiles - An array of strings defining steps to get to each tile
 * @param {number=100} days - Number of days to run the simulation
 * @returns {number} Count of black tiles after the final day
 */
const countDailyTiles = (tiles, days = 100) => {
  let { blackTiles, maxCoord } = getBlackTiles(tiles);
  for (let day = 1; day <= days; day += 1) {
    const nextBlackTiles = new Set();
    for (let x = -maxCoord - day; x <= maxCoord + day; x += 1) {
      for (let y = -maxCoord - day; y <= maxCoord + day; y += 1) {
        const neighb = countBlackNeighbours([x, y], blackTiles);
        const key = [x, y].toString();
        // Black tile with 1 or 2 neighbours remains black
        if (blackTiles.has(key) && (neighb === 1 || neighb === 2)) {
          nextBlackTiles.add(key);
        }
        // White tile with 2 black neighbours flips to black
        else if (!blackTiles.has(key) && neighb === 2) nextBlackTiles.add(key);
      }
    }
    blackTiles = nextBlackTiles;
  }
  return blackTiles.size;
};

module.exports = { countBlackTiles, countDailyTiles };
