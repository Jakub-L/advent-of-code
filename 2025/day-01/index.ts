import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// Constants
const RING_SIZE = 100;
const START_POSITION = 50;
const DELTA = { R: 1, L: -1 };

// Input
const input: string[] = readFile(__dirname + "/input.txt");

// Part 1 & 2
/**
 * Applies a set of rotations to a safe ring and counts the number of times the pointer passes 0.
 *
 * @param startPosition - The starting position on the ring
 * @param rotations - Array of rotations to perform
 * @param countAllClicks - Whether any passing of 0 should count, or just
 *                         the final position
 * @returns The password, which is the number of times the pointer passes 0
 */
const findPassword = (
  startPosition: number,
  rotations: string[],
  countAllClicks: boolean = false
): number => {
  let password = 0;
  let pos = startPosition;

  for (const rotation of rotations) {
    const [_, newDir, steps] = /([RL])(\d+)/g.exec(rotation)!;
    for (let i = 0; i < Number(steps); i++) {
      pos += DELTA[newDir as "R" | "L"];
      if (pos < 0) pos = 99;
      if (pos > RING_SIZE - 1) pos = 0;
      if (countAllClicks && pos === 0) password++;
    }
    if (!countAllClicks && pos === 0) password++;
  }
  return password;
};

// Results
console.log(`Part 1: ${findPassword(START_POSITION, input)}`);
console.log(`Part 2: ${findPassword(START_POSITION, input, true)}`);
