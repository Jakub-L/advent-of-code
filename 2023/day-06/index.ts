import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { prod } from "@jakub-l/aoc-lib/math";

type Race = { duration: number; record: number };

const input: string[] = readFile(__dirname + "/input.txt") as string[];

// INPUT PARSING
const parseIndividualRaces = (input: string[]) => {
  const races: Race[] = [];
  const data: number[][] = input.map(line => line.split(/\s+/).slice(1).map(Number));
  for (let i = 0; i < data[0].length; i++) {
    races.push({ duration: data[0][i], record: data[1][i] });
  }
  return races;
};

const parseSingleRace = (input: string[]): Race => {
  const [duration, record] = input.map(line => line.split(/\s+/).slice(1).join("")).map(Number);
  return { duration, record };
};

// UTILS
/**
 * Counts the ways to win a race.
 *
 * Generally, the distance travelled by the boat is:
 *    distance = (raceDuration - holdTime) * holdTime
 *
 * We also want a situation where the record is beaten, so:
 *    record < distance
 *    record < (raceDuration - holdTime) * holdTime
 *         0 < (raceDuration - holdTime) * holdTime - record
 *
 * We will need to find where this is equal to zero. This allows us to use
 * the quadratic formula to find the two limit hold times:
 *    (- holdTime^2) + raceDuration * holdTime - record = 0
 *
 *    √Δ = sqrt(raceDuration^2 - 4 * record)
 *    holdTime1 = (-raceDuration + √Δ) / -2
 *    holdTime2 = (-raceDuration - √Δ) / -2
 *
 * Knowing these, we can easily find the count of wins. There is a minor
 * adjustment that needs to happen to account for when either of the hold
 * times is not an integer (round up or down) or if it is an integer and
 * equal the record exactly (add or subtract 1).
 *
 * @param {Race} race - The race to inspect
 * @returns {number} The count of different hold times that will result in a win
 */
const waysToWin = (race: Race): number => {
  const { duration, record } = race;
  const sqrtDelta = Math.sqrt(duration ** 2 - 4 * record);
  let lowerTime = (duration - sqrtDelta) / 2;
  let upperTime = (duration + sqrtDelta) / 2;
  lowerTime = Math.ceil(lowerTime) === lowerTime ? lowerTime + 1 : Math.ceil(lowerTime);
  upperTime = Math.floor(upperTime) === upperTime ? upperTime - 1 : Math.floor(upperTime);
  return upperTime - lowerTime + 1;
};

// RESULTS
console.log(`Part 1: ${prod(parseIndividualRaces(input).map(waysToWin))}`);
console.log(`Part 2: ${waysToWin(parseSingleRace(input))}`);
