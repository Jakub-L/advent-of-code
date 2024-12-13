import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

// Constants
const OFFSET = 10_000_000_000_000;

// Types
type Coords = { x: number; y: number };
type Presses = { a: number; b: number };

// Input
const input: string[] = readFile(`${__dirname}/input.txt`, ["\n\n"]);

// Part 1 & 2
/** Represents a single claw machine */
class ClawMachine {
  /** The offset applied to the claw when the A button is pressed once */
  private a: Coords;
  /** The offset applied to the claw when the B button is pressed once */
  private b: Coords;
  /** The coordinates of the prize */
  private prize: Coords;
  /** The number of presses of button A and B required to reach the prize */
  private presses: Presses;

  /**
   * Creates a new claw machine
   * @param {string} definition - The definition of the claw machine
   */
  constructor(definition: string) {
    const [a, b, prize] = definition.split("\n").map(line => {
      const [x, y] = line.match(/[0-9]+/g)!.map(Number);
      return { x, y };
    });

    this.a = a;
    this.b = b;
    this.prize = prize;
    this.presses = this._calculatePresses();
  }

  /**
   * Offsets the prize location by the given amount
   * @param {number} offset - The amount to offset the prize by, applied to both x and y
   * @returns {ClawMachine} - The claw machine with the prize offset
   */
  public offsetPrize(offset: number): ClawMachine {
    this.prize = { x: this.prize.x + offset, y: this.prize.y + offset };
    this.presses = this._calculatePresses();
    return this;
  }

  /**
   * Calculates the number of presses required to reach the prize.
   *
   * The equations used here are derived by solving the following system of equations:
   *      aMoves * a.x + bMoves * b.x = prize.x
   *      aMoves * a.y + bMoves * b.y = prize.y
   *
   * @returns {Presses} - The number of presses of button A and B required to reach the prize,
   *                      or -1 if the prize is unreachable (non-integer or negative presses)
   */
  private _calculatePresses(): Presses {
    const { a, b, prize } = this;
    const bMoves = (a.x * prize.y - prize.x * a.y) / (a.x * b.y - b.x * a.y);
    const aMoves = (prize.x - bMoves * b.x) / a.x;
    if (Number.isInteger(aMoves) && Number.isInteger(bMoves) && aMoves >= 0 && bMoves >= 0) {
      return { a: aMoves, b: bMoves };
    }
    return { a: -1, b: -1 };
  }

  /** The number of tokens required to reach the prize, 3 per A-press and 1 per B-press */
  get tokens(): number {
    if (this.presses.a === -1 || this.presses.b === -1) return 0;
    return 3 * this.presses.a + this.presses.b;
  }
}

// Results
const machines = input.map(definition => new ClawMachine(definition));
const offsetMachines = input.map(definition => new ClawMachine(definition).offsetPrize(OFFSET));

console.log(`Part 1: ${sum(machines.map(machine => machine.tokens))}`);
console.log(`Part 2: ${sum(offsetMachines.map(machine => machine.tokens))}`);
