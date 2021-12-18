/**
 * Solution to Day 17 challenge of Advent of Code 2021
 * https://adventofcode.com/2021/day/17
 */
import { readInput } from '../utils';

// INPUTS
const rawInput = readInput('./../../inputs/day-17.txt').join('');
const coordMatch = /x=(?<x0>-?\d+)..(?<x1>-?\d+).*=(?<y0>-?\d+)..(?<y1>-?\d+)/;
const matches = rawInput.match(coordMatch)?.groups || {};
const { x0, x1, y0, y1 } = Object.entries(matches).reduce<{
  [index: string]: number;
}>((acc, [key, val]) => ({ ...acc, [key]: Number(val) }), {});

// PART 1
/* Due to the constant acceleration down on the probe, no matter what velocity we
 * fire upwards at, the velocity will be the same (but downwards) when the probe
 * passes the y = 0 (probe) plane. Therefore, we only need to consider the behaviour
 * from y = 0 down.
 *
 * The faster the probe is fired, the higher it would reach. What is the maximum speed
 * a probe can reach and still be inside the target after a step? Well, it should
 * be at y = 0 at t, and at y = y0 at t + 1 (where y0 is the bottom border of the
 * target area). Therefore, the probe must be travelling at v = y0.
 *
 * Finding the peak is pretty straightforward now. At the top of the peak, the velocity
 * is zero. If the probe is travelling y0 units at the final step, then it travelled
 * y0 - 1 at the step before (first step above y = 0), y0 - 2 before that and so forth.
 * The total height of the peak is therefore:
 *    h = 1 + 2 + 3 + 4 + 5 + ... + (y0 - 3) + (y0 - 2) + (y0 - 1)
 * Which is a triangular number and can be calculated from a closed form.
 */

/**
 * Finds the highest position above a starting level that a fired probe can
 * achieve, while still landing in the target area
 * @param {number} y0 - The lower y-bound of the target area
 * @returns {number} The maximum peak achievable
 */
const findPeak = (y0: number) => ((Math.abs(y0) - 1) * Math.abs(y0)) / 2;

// PART 2
/* The minimum x speed is such that the probe crosses the x = x0 line with 1 velocity.
 * This means that the starting speed has to be at least such that:
 *    1 + 2 + 3 + ... + vstart >= x0
 * Similarly to part 1, this is a triangular number that can be found using the quadratic
 * formula (we can ignore the negative root):
 *    vstart = ceil(0.5*(sqrt(8 * x0 + 1) - 1))
 * The maximum x speed is such that the probe ends up just past x = x1 line after the first
 * step. This means vmax = x1
 *
 * For the minimum/maximum y speeds, we already found from the above, that the maximum
 * starting speed is abs(y0) - 1. This can be in both directions, as the distance
 * travelled above y = 0 can be ignored for the purposes of vertical positions.
 *
 * These values can be iterated through and the possible pairs found.
 */

/**
 * Counts all possible starting probe velocities that hits a target region
 * @param {number} x0 - The left boundary of the target region
 * @param {number} x1 - The right boundary of the target region
 * @param {number} y0 - The bottom boundary of the target region
 * @param {number} y1 - The top boundary of the target region
 * @returns {number} Count of different starting velocities that hit the target
 */
const countAllVelocities = (
  x0: number,
  x1: number,
  y0: number,
  y1: number
): number => {
  const [vminY, vmaxY] = [-Math.abs(y0), Math.abs(y0) - 1];
  const [vminX, vmaxX] = [Math.ceil(0.5 * Math.sqrt(8 * x0 + 1) - 1), x1];
  let count = 0;

  for (let i = vminY; i <= vmaxY; i++) {
    for (let j = vminX; j <= vmaxX; j++) {
      let [x, y, vX, vY] = [0, 0, j, i];
      while (x <= x1 && y >= y0) {
        [x, y] = [x + vX, y + vY];
        [vX, vY] = [Math.max(0, vX - 1), vY - 1];
        if (x >= x0 && y <= y1 && x <= x1 && y >= y0) {
          count += 1;
          break;
        }
      }
    }
  }
  return count;
};

// OUTPUTS
console.log(`Part 1: ${findPeak(y0)}`);
console.log(`Part 2: ${countAllVelocities(x0, x1, y0, y1)}`);
