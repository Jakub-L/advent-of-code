/**
 * Finds the four edges of a map tile as strings
 * @param {string[]} tileString - String array format of a tile's contents
 * @returns {string[]} Array of four edges, clockwise from top
 */
const getEdges = (tileString) => [
  tileString[0],
  tileString.reduce((acc, row) => `${acc}${row[row.length - 1]}`, ''),
  tileString[tileString.length - 1],
  tileString.reduce((acc, row) => `${acc}${row[0]}`, '')
];

/** Class representing a map tile */
class Tile {
  /**
   * Create a tile
   * @param {string[]} tileString - Raw tilestring, including tile ID row
   */
  constructor(tileString) {
    const [nameRow, ...tile] = tileString;
    this.id = Number(/\d+/.exec(nameRow)[0]);
    this.edges = getEdges(tile);
  }

  /**
   * Check whether a tile's edges match any of a comparison tile's edges. Considers reflection.
   * @param {Tile} comparison - tile instance to check against
   * @returns {number[]} Array of matches for each of the four edges, clockwise from top
   */
  matchTiles(comparison) {
    return this.edges.reduce((matches, sourceEdge) => {
      // Need to check every of the source edges against all four edges of the target
      const matchCount = comparison.edges.reduce(
        (sum, compareEdge) =>
          sum +
          (compareEdge === sourceEdge) + // Regular comparison
          (compareEdge === [...sourceEdge].reverse().join('')), // Check edge reflection as well

        0
      );
      return [...matches, matchCount];
    }, []);
  }
}

/**
 * Converts a raw input string array into an array of Tile objects
 * @param {strings[]} tileStrings - Raw tilestrings, including tile ID rows
 * @returns {Tile[]} Array of Tiles representing each map tile
 */
const parseInput = (tileStrings) =>
  tileStrings.reduce((acc, tileString) => [...acc, new Tile(tileString)], []);

/**
 * Finds the tiles on corners of a completed map
 * @param {Tile[]} tiles - Array of Tiles representing each map tile
 * @returns {number[]} - IDs of corner tiles
 */
const findCorners = (tiles) =>
  tiles.reduce((corners, sourceTile) => {
    // Compare every tile against every other tile in the array
    const totalMatchesPerEdge = tiles.reduce(
      (totalMatches, compareTile) => {
        if (sourceTile.id === compareTile.id) return totalMatches;
        const edgeMatches = sourceTile.matchTiles(compareTile);
        return totalMatches.map((edge, edgeI) => edge + edgeMatches[edgeI]);
      },
      [0, 0, 0, 0]
    );
    console.log(sourceTile.id, totalMatchesPerEdge);
    // Corner tiles will have 2 edges which do not fit match _any_ other tile's edge
    if (totalMatchesPerEdge.filter((e) => !e).length === 2)
      return [...corners, sourceTile.id];
    return corners;
  }, []);

/**
 * Finds the product of tile IDs for tiles which end up on the corners of a completed map
 * @param {strings[]} tileStrings - Raw tilestrings, including tile ID rows
 * @returns {number} Product of all corner tile IDs
 */
const findCornerProduct = (tileStrings) => {
  const tiles = parseInput(tileStrings);
  const corners = findCorners(tiles);
  return corners.reduce((product, cornerId) => product * cornerId, 1);
};

module.exports = { findCornerProduct };
