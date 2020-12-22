//
// TYPE DEFINITONS
//
/**
 * @typedef {Object} Edges
 * @param {string} top - The top edge
 * @param {string} bottom - The bottom edge
 * @param {string} left - The left edge
 * @param {string} right - The right edge
 */

/**
 * @typedef {Object} Tile
 * @param {number} id - The ID of the tile
 * @param {Edges} edges - The four edges of the tile
 * @param {string[][]} tile - Array representation of the map tile
 * @param {string[][]} croppedTile - Array representation of the map tile with removed edges
 */

/**
 * @typedef {Object.<string, Tile>} EdgeLookupRow
 * A row of the lookup table, with each key being an ID of a tile and the value being that tile
 */

/**
 * @typedef {Object.<string, EdgeLookupRow>} EdgeLookupDirection
 * Part of the lookup array. Each entry is keyed by the string representation of an edge
 */

/**
 * @typedef {Object} EdgeLookup
 * @param {EdgeLookupDirection} top - Top edge lookup
 * @param {EdgeLookupDirection} bottom - Bottom edge lookup
 * @param {EdgeLookupDirection} left - Left edge lookup
 * @param {EdgeLookupDirection} right - Right edge lookup
 */

//
// FUNCTIONALITY
//
/**
 * Flips tile such that top row becomes bottom row
 * @param {string[][]} tile - Array representation of the map tile
 * @returns {string[][]} Input tile flipped vertically
 */
const flipVertical = (tile) => [...tile].reverse();

/**
 * Flips tile such that right column becomes left column
 * @param {string[][]} tile - Array representation of the map tile
 * @returns {string[][]} Input tile flipped horizontally
 */
const flipHorizontal = (tile) => tile.map((row) => [...row].reverse());

/**
 * Rotates the tile counter-clockwise (to the left)
 * @param {string[][]} tile - Array representation of the map tile
 * @returns {string[][]} Input tile rotated by 90 degrees counter-clockwise
 */
const rotateCCW = (tile) =>
  tile.map((row, y) => row.map((_, x) => tile[x][row.length - y - 1]));

/**
 * Class representing a single map tile
 */
class Tile {
  /**
   * Creates a new tile
   * @param {number} id - The ID of the tile
   * @param {string[][]} tile - Array representation of the map tile
   */
  constructor(id, tile) {
    this.id = id;
    this.edges = {
      top: tile[0].join(''),
      bottom: tile[tile.length - 1].join(''),
      left: tile.reduce((edg, row) => `${edg}${row[0]}`, ''),
      right: tile.reduce((edg, row) => `${edg}${row[row.length - 1]}`, '')
    };
    this.tile = tile;
    this.croppedTile = tile
      .slice(1, tile.length - 1)
      .map((row) => row.slice(1, row.length - 1));
  }

  /** Creates a new tile that represents a vertical flip of the parent */
  flipVertical() {
    return new Tile(this.id, flipVertical(this.tile));
  }

  /** Creates a new tile that represents a horizontal flip of the parent */
  flipHorizontal() {
    return new Tile(this.id, flipHorizontal(this.tile));
  }

  /** Creates a new tile that represents a counter-clockwise rotation of the parent */
  rotateCCW() {
    return new Tile(this.id, rotateCCW(this.tile));
  }
}

/**
 * Converts raw input strings to Tile objects
 * @param {string[][]} input - Raw representation of a tile, with first row containing the tile ID
 * @returns {Tile[]} Array of Tiles representing the input
 */
const parseInput = (input) =>
  input.map((tileString) => {
    const [nameRow, ...rawTile] = tileString;
    const id = Number(/\d+/.exec(nameRow)[0]);
    const tile = rawTile.map((r) => r.split(''));
    return new Tile(id, tile);
  });

/**
 * Generates a mapping of tile edges to individual tiles
 * @param {Tile[]} tiles - Array of tiles to map
 * @returns {EdgeLookup} Dictionary of edges (top, bottom, left, right) and which tiles have them
 */
const getEdgeLookup = (tiles) => {
  const edgeLookup = {
    top: {},
    bottom: {},
    left: {},
    right: {}
  };

  /**
   * Adds a tile to the edge lookup dictionary
   * @param {Tile} tile - Tile object to add
   * @param {number} id - The ID of the tile
   * @param {string} edge - An edge of the tile
   * @param {EdgeLookupDirection} lookup - A direction's lookup
   */
  const addTileEdgeToLookup = (tile, id, edge, lookup) => {
    if (!(edge in lookup)) lookup[edge] = {};
    lookup[edge][id] = tile;
  };

  /**
   * Adds all four edges of a tile to the lookup dictionary
   * @param {Tile} tile - Tile object to add
   */
  const addTile = (tile) => {
    ['top', 'bottom', 'left', 'right'].forEach((dir) =>
      addTileEdgeToLookup(tile, tile.id, tile.edges[dir], edgeLookup[dir])
    );
  };

  tiles.forEach((tile) => {
    for (let i = 0; i < 4; i += 1) {
      addTile(tile);
      addTile(tile.flipHorizontal());
      addTile(tile.flipVertical());
      tile = tile.rotateCCW();
    }
  });

  return edgeLookup;
};

/**
 * Finds if a match for a tile exists in the given direction
 * @param {number} id - id of the tile
 * @param {string} right - The right edge
 * @param {EdgeLookupDirection} dirLookup - Edge dictionary for a particular direction
 * @returns {boolean} True if a match exists for a given tile in that direction
 */
const hasDirectionMatch = (id, edge, dirLookup) => {
  if (!(edge in dirLookup)) return false;
  // If our tile is in the dirLookup, we must have at least one other tile
  if (id in dirLookup[edge]) return Object.keys(dirLookup[edge]).length === 2;
  return Object.keys(dirLookup[edge]).length === 1;
};

/**
 * Determines whether a tile is a corner tile
 * @param {Tile} tile - Tile to inspect
 * @param {EdgeLookup} lookup - Edge dictionary for all directions
 * @returns {boolean} True if the tile is a corner, false otherwise
 */
const isCorner = ({ id, edges }, lookup) => {
  const neighbours = Object.entries(edges).reduce(
    (acc, [dir, edge]) => acc + hasDirectionMatch(id, edge, lookup[dir]),
    0
  );
  return neighbours === 2;
};

/**
 * Finds the product of the IDs of the corner tiles
 * @param {string[][]} input - Raw representation of a tile, with first row containing the tile ID
 * @returns {number} Product of corner tile IDs
 */
const findCornerProduct = (input) => {
  const tiles = parseInput(input);
  const dict = getEdgeLookup(tiles);
  return tiles.reduce(
    (prod, tile) => (isCorner(tile, dict) ? prod * tile.id : prod),
    1
  );
};

/**
 * Reconstructs the map from given tiles. Orientation non-specific
 * @param {string[][]} input - Raw representation of a tile, with first row containing the tile ID
 * @returns {string[]} Reconstructed map, with edges of each tile removed
 */
const reconstructMap = (input) => {
  const tiles = parseInput(input);
  const dict = getEdgeLookup(tiles);
  const size = Math.floor(Math.sqrt(tiles.length));
  const usedTiles = new Set();
  const placedTiles = Array(size)
    .fill()
    .map((r) => Array(size).fill(null));

  // Find the top-left tile
  placedTiles[0][0] = tiles.find(
    ({ id, edges }) =>
      !hasDirectionMatch(id, edges.top, dict.top) &&
      hasDirectionMatch(id, edges.bottom, dict.bottom) &&
      !hasDirectionMatch(id, edges.left, dict.left) &&
      hasDirectionMatch(id, edges.right, dict.right)
  );
  usedTiles.add(placedTiles[0][0].id);

  // Reconstruct rows, top to bottom
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      let prevTile, options;
      // Top left tile, just placed
      if (row === 0 && col === 0) continue;
      if (row === 0) {
        // For first row, match with tile to the left
        prevTile = placedTiles[row][col - 1];
        options = dict.left[prevTile.edges.right];
      } else {
        // For remaining rows, match with tile above
        prevTile = placedTiles[row - 1][col];
        options = dict.top[prevTile.edges.bottom];
      }
      const match = Object.values(options).find(
        ({ id }) => !usedTiles.has(id) && id !== prevTile.id
      );
      placedTiles[row][col] = match;
    }
  }

  // Actually create the map image
  return placedTiles.reduce((combinedImage, mapRow) => {
    const firstTile = mapRow[0].croppedTile;
    // Iterate through all rows of the individual tiles
    for (let tileRow = 0; tileRow < firstTile.length; tileRow += 1) {
      // Combine all tile's rows across the map into one string
      const string = mapRow.reduce(
        (line, { croppedTile }) => [...line, ...croppedTile[tileRow].join('')],
        []
      );
      combinedImage.push(string);
    }
    return combinedImage;
  }, []);
};

const findSeaRoughness = (input) => {
  let reconstructed = reconstructMap(input);
  const monster = [
    '                  # ',
    '#    ##    ##    ###',
    ' #  #  #  #  #  #   '
  ].map((row) => row.split(''));

  const countMonsters = (seaMap) => {
    let count = 0;
    for (let row = 0; row < seaMap.length - monster.length; row += 1) {
      for (let col = 0; col < seaMap[0].length - monster[0].length; col += 1) {
        let monsterFound = true;
        for (let dRow = 0; dRow < monster.length; dRow += 1) {
          for (let dCol = 0; dCol < monster[0].length; dCol += 1) {
            if (
              monster[dRow][dCol] === '#' &&
              seaMap[row + dRow][col + dCol] !== '#'
            )
              monsterFound = false;
          }
        }
        if (monsterFound) count += 1;
      }
    }
    return count;
  };

  // Find monster count for all orientations of the grid
  const allCounts = [];
  for (let i = 0; i < 4; i += 1) {
    allCounts.push(
      countMonsters(reconstructed),
      countMonsters(flipHorizontal(reconstructed)),
      countMonsters(flipVertical(reconstructed))
    );
    reconstructed = rotateCCW(reconstructed);
  }

  const count = allCounts.find((c) => c);
  const totalRoughness = reconstructed
    .map((row) => row.join(''))
    .join('')
    .match(/#/g).length;
  const monsterRoughness = monster
    .map((row) => row.join(''))
    .join('')
    .match(/#/g).length;
  return totalRoughness - count * monsterRoughness;
};

module.exports = { findSeaRoughness, findCornerProduct };
