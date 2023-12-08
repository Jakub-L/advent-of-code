import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

const input: string[] = readFile(__dirname + "/input.txt", ["\n", " "]) as string[];

const test = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`
  .split("\n")
  .map(line => line.split(" "));

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

class Card {
  bet: number;
  cards: CardType[] = [];
  handType: HandType;
  private _useJokers: boolean;

  constructor(cardString: string, betString: string, useJokers: boolean = false) {
    this._useJokers = useJokers;
    this.bet = Number(betString);
    this.cards = cardString.split("").map(card => cardLookup(useJokers)[card]);
    this.handType = this._getHandType(cardString);
  }

  private _getHandType(cardString: string): HandType {
    const counts = cardString
      .split("")
      .reduce((counts, card) => ({ ...counts, [card]: (counts[card] ?? 0) + 1 }), {} as { [index: string]: number });
    const [topCount, secondCount] = Object.values(counts).sort((a, b) => b - a);
    if (topCount === 5) return HandType.fiveOfAKind;
    if (topCount === 4) return HandType.fourOfAKind;
    if (topCount === 3 && secondCount === 2) return HandType.fullHouse;
    if (topCount === 3) return HandType.threeOfAKind;
    if (topCount === 2 && secondCount === 2) return HandType.twoPairs;
    if (topCount === 2) return HandType.onePair;
    return HandType.highCard;
  }
}

const compareCards = (a: Card, b: Card): number => {
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
  test
    .map(([cards, bet]) => new Card(cards, bet))
    .sort(compareCards)
    .map((card, i) => card.bet * (i + 1))
);

// RESULTS
console.log(`Part 1: ${totalWinningsWithoutJokers}`);
