import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

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

const part1 = sum(input.map(parseGame).map(game => (isPossible(game) ? game.number : 0)));
console.log(`Part 1: ${part1}`);
