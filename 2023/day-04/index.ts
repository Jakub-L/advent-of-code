import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

type Card = {
  winningNumbers: Set<number>;
  drawnNumbers: Set<number>;
  matches: number;
  points: number;
};

const input: string[] = readFile(__dirname + "/input.txt") as string[];

// UTILS
/**
 * Finds intersection of two sets
 * @param {Set<T>} setA - First set
 * @param {Set<T>} setB - Second set
 * @returns {Set<T>} A set of elements both in setA and setB
 */
const intersection = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  const result = new Set<T>();
  const [smaller, bigger] = setA.size < setB.size ? [setA, setB] : [setB, setA];
  for (const item of smaller) {
    if (bigger.has(item)) result.add(item);
  }
  return result;
};

/**
 * Parses a card string into an object
 * @param {string} card - A card string
 * @returns {Card} The parsed Card
 */
const parseCard = (card: string): Card => {
  const [_, numbers] = card.split(": ");
  const [winningStrings, drawnStrings] = numbers.split(" | ").map(s => s.trim().split(/\s+/));
  const winningNumbers = new Set(winningStrings.map(Number));
  const drawnNumbers = new Set(drawnStrings.map(Number));
  const matches = intersection(winningNumbers, drawnNumbers).size;
  const points = matches < 2 ? matches : 2 ** (matches - 1);
  return { winningNumbers, drawnNumbers, matches, points };
};

/**
 * Processes a list of cards by adding 1 copy of N following cards, where N is the number of
 * matches of the current card
 * @param {Card[]} cards - A list of cards
 * @returns {number} The total number of cards processed
 */
const processCards = (cards: Card[]): number => {
  const winCounts: { [index: number]: number } = {};
  for (let i = 0; i < cards.length; i++) {
    for (let j = 1; j <= cards[i].matches; j++) {
      winCounts[i + j] = (winCounts[i + j] ?? 0) + (winCounts[i] ?? 0) + 1;
    }
  }
  return sum(Object.values(winCounts)) + cards.length;
};

// RESULTS
console.log(`Part 1: ${sum(input.map(parseCard).map(card => card.points))}`);
console.log(`Part 2: ${processCards(input.map(parseCard))}`);
