import { readFile } from "@jakub-l/aoc-lib/input-parsing";

const RING_SIZE = 100;

const input: string[] = readFile(__dirname + "/input.txt");

const testInput = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`.split("\n");

const step = (position: number, rotation: string): number => {
  const [_, dir, steps] = /([RL])(\d+)/g.exec(rotation)!;
  const sign = dir === "R" ? 1 : -1;
  let newPosition = position + sign * Number(steps);
  while (newPosition < 0) newPosition += RING_SIZE;
  return newPosition % RING_SIZE;
};

const findPassword = (position: number, rotations: string[]): number => {
  let password = 0;
  for (const rotation of rotations) {
    position = step(position, rotation);
    if (position === 0) password += 1;
  }
  return password;
};

console.log(findPassword(50, input));
