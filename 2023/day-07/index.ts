import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

const input: string[] = readFile(__dirname + "/input.txt", ["\n", " "]) as string[];

// UTILS
enum HandType {
  highCard,
  onePair,
  twoPairs,
  threeOfAKind,
  fullHouse,
  fourOfAKind,
  fiveOfAKind
}
enum CardType {
  joker,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  nine,
  ten,
  jack,
  queen,
  king,
  ace
}
const cardLookup = (useJokers: boolean): { [key: string]: CardType } => ({
  "2": CardType.two,
  "3": CardType.three,
  "4": CardType.four,
  "5": CardType.five,
  "6": CardType.six,
  "7": CardType.seven,
  "8": CardType.eight,
  "9": CardType.nine,
  T: CardType.ten,
  J: useJokers ? CardType.joker : CardType.jack,
  Q: CardType.queen,
  K: CardType.king,
  A: CardType.ace
});

/**
 * A hand of cards
 * @class
 */
class Hand {
  /** The bet amount */
  bet: number;
  /** The cards in the hand */
  cards: CardType[] = [];
  /** The type of hand */
  handType: HandType;
  /** Whether to use jokers as wildcards */
  private _useJokers: boolean;
  /** The number of cards of each type in the hand */
  private _cardCounts: Map<CardType, number> = new Map();

  /**
   * Creates a new hand
   * @param {string} cardString - The string representing the cards in the hand
   * @param {string} betString - The string representing the bet amount
   * @param {boolean} [useJokers=false] - Whether to use jokers as wildcards
   */
  constructor(cardString: string, betString: string, useJokers: boolean = false) {
    this.bet = Number(betString);
    this.cards = cardString.split("").map(card => cardLookup(useJokers)[card]);
    this._cardCounts = this.cards.reduce((acc, card) => acc.set(card, (acc.get(card) || 0) + 1), new Map());
    this._useJokers = useJokers;
    this.handType = this._getHandType();
  }

  /**
   * Evaluates the type of the hand
   * @returns {HandType} The type of hand
   */
  private _getHandType(): HandType {
    const jokerCount = this._cardCounts.get(CardType.joker) ?? 0;
    if (this._useJokers) this._cardCounts.delete(CardType.joker);
    const orderedCounts = Array.from(this._cardCounts.values()).sort((a, b) => b - a);
    const topCount = (orderedCounts[0] ?? 0) + jokerCount;
    const secondCount = orderedCounts[1] ?? 0;
    if (topCount === 5) return HandType.fiveOfAKind;
    if (topCount === 4) return HandType.fourOfAKind;
    if (topCount === 3 && secondCount === 2) return HandType.fullHouse;
    if (topCount === 3) return HandType.threeOfAKind;
    if (topCount === 2 && secondCount === 2) return HandType.twoPairs;
    if (topCount === 2) return HandType.onePair;
    return HandType.highCard;
  }
}

/**
 * Compares two cards, first by hand type then by card values in order
 * @param {Hand} a - First card
 * @param {Hand} b - Second card
 * @returns {number} Comparator value (-1, 0 or 1)
 */
const compareCards = (a: Hand, b: Hand): number => {
  if (a.handType > b.handType) return 1;
  if (a.handType < b.handType) return -1;
  for (let i = 0; i < a.cards.length; i++) {
    if (a.cards[i] > b.cards[i]) return 1;
    if (a.cards[i] < b.cards[i]) return -1;
  }
  return 0;
};

// PART 1
const totalWinningsWithoutJokers = sum(
  input
    .map(([cards, bet]) => new Hand(cards, bet))
    .sort(compareCards)
    .map((card, i) => card.bet * (i + 1))
);

// PART 2
const totalWinningsWithJokers = sum(
  input
    .map(([cards, bet]) => new Hand(cards, bet, true))
    .sort(compareCards)
    .map((card, i) => card.bet * (i + 1))
);

// RESULTS
console.log(`Part 1: ${totalWinningsWithoutJokers}`);
console.log(`Part 2: ${totalWinningsWithJokers}`);
