/**
 * Plays a game of Combat until the end
 * @param {number[]} deck1 - Deck of cards belonging to player 1
 * @param {number[]} deck2 - Deck of cards belonging to player 2
 * @returns {number[]} Winner's deck in final configuration
 */
const combat = (deck1, deck2) => {
  while (deck1.length && deck2.length) {
    const [card1, card2] = [deck1.shift(), deck2.shift()];
    if (card1 > card2) deck1.push(card1, card2);
    else deck2.push(card2, card1);
  }
  return deck1.length ? deck1 : deck2;
};

/**
 * Plays a game of Recursive Combat until the end
 * @param {number[]} startDeck1 - Deck of cards belonging to player 1 in initial arrangement
 * @param {number[]} startDeck2 - Deck of cards belonging to player 2 in initial arrangement
 * @returns {number[]} Winner's deck in final configuration
 */
const recursiveCombat = (startDeck1, startDeck2) => {
  /**
   *  Plays a single game of recursive combat
   * @param {number[]} deck1 - Deck of cards belonging to player 1
   * @param {number[]} deck2 - Deck of cards belonging to player 2
   * @returns {boolean} True if player 1 wins game, false if player 2 wins game
   */
  const playGame = (deck1, deck2) => {
    const seenDecks = new Set();
    while (deck1.length && deck2.length) {
      // If this arrangement already occured, immediately return a win for player 1. Otherwise keep track of it
      const arrangement = JSON.stringify([deck1, deck2]);
      if (seenDecks.has(arrangement)) return true;
      seenDecks.add(arrangement);

      // Take top two cards
      const [card1, card2] = [deck1.shift(), deck2.shift()];
      let p1Wins;

      // If enough cards left, recurse. Otherwise higher card wins
      if (card1 <= deck1.length && card2 <= deck2.length) {
        p1Wins = playGame(deck1.slice(0, card1), deck2.slice(0, card2));
      } else p1Wins = card1 > card2;
      // Winning card goes first on the winner's deck
      if (p1Wins) deck1.push(card1, card2);
      else deck2.push(card2, card1);
    }
    return Boolean(deck1.length);
  };
  return playGame(startDeck1, startDeck2) ? startDeck1 : startDeck2;
};

/**
 * Finds the winner's score in a game of combat
 * @param {number[][]} decks - Array of decks, one per player
 * @param {boolean=false} recursive - Should recursive combat be used
 * @returns {number} Score of the winner's deck, which is the sum of card value times it's position in the deck, counting from the end
 */
const findWinnerScore = (deck1, deck2, recursive = false) => {
  // Make local copies so the inputs don't get modified in place
  [deck1, deck2] = [[...deck1], [...deck2]];
  const winnerDeck = recursive
    ? recursiveCombat(deck1, deck2)
    : combat(deck1, deck2);
  return winnerDeck.reduce(
    (acc, card, i, deck) => acc + card * (deck.length - i),
    0
  );
};
module.exports = { findWinnerScore };
