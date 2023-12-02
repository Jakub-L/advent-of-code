import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { prod, sum } from "@jakub-l/aoc-lib/math";

type Game = {
  number: number;
  draws: {
    red: number;
    blue: number;
    green: number;
  }[];
};
type CubeCounts = { red: number; blue: number; green: number };

const input: string[] = readFile(__dirname + "/input.txt") as string[];

/**
 * Parses a game string and returns a Game object.
 *
 * @param {string} game - The game string to parse.
 * @returns {Game} The parsed Game object.
 */
const parseGame = (game: string): Game => {
  const [gameString, drawsString] = game.split(": ");
  const number = Number(gameString.match(/\d+/g)?.[0]);
  const draws = drawsString.split("; ").map(draw => ({
    red: Number(draw.match(/(\d+) red/)?.[1] ?? 0),
    blue: Number(draw.match(/(\d+) blue/)?.[1] ?? 0),
    green: Number(draw.match(/(\d+) green/)?.[1] ?? 0)
  }));
  return { number, draws };
};

const games = input.map(parseGame);

// Part 1
/**
 * Checks whether a game is possible with the given number of cubes.
 *
 * @param {Game} game - The game to check.
 * @param {CubeCounts} cubes - The number of cubes available.
 * @returns {boolean} Whether the game is possible.
 */
const isPossible = (game: Game, cubes: CubeCounts = { red: 12, green: 13, blue: 14 }): boolean => {
  for (const draw of game.draws) {
    if (draw.red > cubes.red || draw.blue > cubes.blue || draw.green > cubes.green) {
      return false;
    }
  }
  return true;
};

const part1 = sum(games.map(game => (isPossible(game) ? game.number : 0)));
console.log(`Part 1: ${part1}`);

// Part 2
/**
 * Returns the minimum number of cubes needed to play the given game.
 *
 * @param {Game} game - The game to check.
 * @returns {CubeCounts} The minimum number of cubes needed.
 */
const minimumCubes = (game: Game): CubeCounts => {
  const minimum = { red: 0, blue: 0, green: 0 };
  for (const draw of game.draws) {
    minimum.red = Math.max(minimum.red, draw.red);
    minimum.blue = Math.max(minimum.blue, draw.blue);
    minimum.green = Math.max(minimum.green, draw.green);
  }
  return minimum;
};

/**
 * Returns the power of the given cube counts (product of all cube counts).
 *
 * @param {CubeCounts} cubes - The cube counts.
 * @returns {number} The power of the cube counts.
 */
const cubePower = (cubes: CubeCounts): number => prod(Object.values(cubes));

console.log(`Part 2: ${sum(games.map(minimumCubes).map(cubePower))}`);
