/**
 * Solution to Day 22 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/22
 */
import { readInput } from '../utils';

// INPUTS
// prettier-ignore
const startingGrove: string[][] = readInput('./day-23/input.txt', '\n')
  .map(row => row.split(''));

// UTILS
type Dir = [x: number, y: number];
type ProposalOption = { move: Dir; checks: Dir[] };
type ProposalList = { move: Dir; elves: Elf[] };

// prettier-ignore
const neighbours: number[][] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1]
]

// prettier-ignore
const proposalOptions: ProposalOption[] = [
  { move: [0, -1], checks: [[0, -1], [1, -1], [-1, -1]] },
  { move: [0, 1], checks: [[0, 1], [1, 1], [-1, 1]] },
  { move: [-1, 0], checks: [[-1, 0], [-1, 1], [-1, -1]] },
  { move: [1, 0], checks: [[1, 0], [1, 1], [1, -1]] }
];

/** A single elf */
class Elf {
  /** x-position (column) */
  x: number;
  /** y-positon (row) */
  y: number;
  /** Map lookup key */
  key: string;

  /**
   * Creates a new elf
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.key = `${x},${y}`;
  }

  /**
   * Checks whether an elf has any neighbours (all 8 directions)
   * @param {Map.<string, Elf>} elves - Map of all eleves and their current positions
   * @returns {boolean} True if there are other elves in neighbouring cells, false otherwise
   */
  hasNeighbours(elves: Map<string, Elf>): boolean {
    return neighbours.some(([dx, dy]) => elves.has(`${this.x + dx},${this.y + dy}`));
  }

  /**
   * Finds the elf's proposed movement
   * @param {Map.<string, Elf>} elves - Map of all eleves and their current positions
   * @param {number} propIndex - Index of the first proposed move
   * @returns {Dir} [x, y] positions of the proposed move
   */
  findProposal(elves: Map<string, Elf>, propIndex: number): Dir {
    let result: Dir = [this.x, this.y];
    for (let i = propIndex; i < propIndex + proposalOptions.length; i++) {
      const { move, checks } = proposalOptions[i % proposalOptions.length];
      if (checks.every(([dx, dy]) => !elves.has(`${this.x + dx},${this.y + dy}`))) {
        result = [this.x + move[0], this.y + move[1]];
        break;
      }
    }
    return result;
  }

  /**
   * Moves the point to the new location
   * @param {Dir} move - Updated x, y coordinates
   */
  move([x, y]: Dir) {
    this.x = x;
    this.y = y;
    this.key = `${x},${y}`;
  }
}

/** A grove with elves */
class Grove {
  /** Elves and their positions */
  elves: Map<string, Elf> = new Map();
  /** Index of the proposed direction to look at first */
  propIndex: number = 0;

  /**
   * Creates a new grove
   * @param {string[][]} startingGrove - Grid of characters representing initial
   *    elf placement in the grove
   */
  constructor(startingGrove: string[][]) {
    for (let y = 0; y < startingGrove.length; y++) {
      for (let x = 0; x < startingGrove[y].length; x++) {
        if (startingGrove[y][x] === '#') {
          const elf = new Elf(x, y);
          this.elves.set(elf.key, elf);
        }
      }
    }
  }

  /**
   * Plays a number of rounds
   * @param {number} count - How many rounds to play
   */
  playRounds(count: number) {
    for (let n = 0; n < count; n++) {
      this.round();
    }
  }

  /**
   * Plays the game until no more elves move
   * @returns {number} First round during which there was no movement
   */
  playUntilDone(): number {
    let rounds = 0;
    let keepPlaying = true;
    while (keepPlaying) {
      keepPlaying = this.round();
      rounds++;
    }
    return rounds;
  }

  /** Number of empty spaces in the minimum square containing all elves */
  get emptySpaces(): number {
    const { minX, maxX, minY, maxY } = Array.from(this.elves.values()).reduce(
      (acc, { x, y }) => ({
        minX: Math.min(acc.minX, x),
        maxX: Math.max(acc.maxX, x),
        minY: Math.min(acc.minY, y),
        maxY: Math.max(acc.maxY, y)
      }),
      { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
    );
    return (maxX - minX + 1) * (maxY - minY + 1) - this.elves.size;
  }

  /**
   * Plays a single round of the elf movement game
   * @returns {boolean} Whether any elves moved during this turn
   */
  private round(): boolean {
    const proposals: { [key: string]: ProposalList } = {};
    for (const elf of this.elves.values()) {
      if (elf.hasNeighbours(this.elves)) {
        const [x, y] = elf.findProposal(this.elves, this.propIndex);
        if (`${x},${y}` in proposals) {
          proposals[`${x},${y}`].elves.push(elf);
        } else {
          proposals[`${x},${y}`] = { move: [x, y], elves: [elf] };
        }
      }
    }
    this.propIndex = (this.propIndex + 1) % proposalOptions.length;
    if (Object.values(proposals).length === 0) return false;
    for (const { move, elves } of Object.values(proposals)) {
      if (elves.length === 1) {
        this.elves.delete(elves[0].key);
        elves[0].move(move);
        this.elves.set(elves[0].key, elves[0]);
      }
    }
    return true;
  }
}

// PART 1
const grove1 = new Grove(startingGrove);
grove1.playRounds(10);

// PART 2
const grove2 = new Grove(startingGrove);

// RESULTS
console.log(`Part 1 solution: ${grove1.emptySpaces}`);
console.log(`Part 2 solution: ${grove2.playUntilDone()}`);
