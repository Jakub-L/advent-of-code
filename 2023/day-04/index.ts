import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

type Card = {
  winningNumbers: Set<number>;
  drawnNumbers: Set<number>;
  matches: number;
  points: number;
};

const input: string[] = readFile(__dirname + "/input.txt") as string[];

const test = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`.split("\n");

const intersection = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  const result = new Set<T>();
  const [smaller, bigger] = setA.size < setB.size ? [setA, setB] : [setB, setA];
  for (const item of smaller) {
    if (bigger.has(item)) result.add(item);
  }
  return result;
};

const calculatePoints = (matches: number): number => {
  if (matches === 0) return 0;
  if (matches === 1) return 1;
  return 2 ** (matches - 1);
};

const parseCard = (card: string) => {
  const [_, numbers] = card.split(": ");
  const [winningStrings, drawnStrings] = numbers.split(" | ").map(s => s.trim().split(/\s+/));
  const winningNumbers = new Set(winningStrings.map(Number));
  const drawnNumbers = new Set(drawnStrings.map(Number));
  const matches = intersection(winningNumbers, drawnNumbers).size;
  const points = calculatePoints(matches);
  return { winningNumbers, drawnNumbers, matches, points };
};

const processCards = (cards: Card[]): number => {
  const winCounts: { [index: number]: number } = {};
  for (let i = 0; i < cards.length; i++) {
    for (let j = 1; j <= cards[i].matches; j++) {
      winCounts[i + j] = (winCounts[i + j] ?? 0) + (winCounts[i] ?? 0) + 1;
    }
  }
  return sum(Object.values(winCounts)) + cards.length;
};

console.log(`Part 1: ${sum(input.map(parseCard).map(card => card.points))}`);
console.log(`Part 2: ${processCards(input.map(parseCard))}`);
