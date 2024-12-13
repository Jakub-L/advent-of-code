import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

const OFFSET = 10_000_000_000_000;

type Coords = { x: number; y: number };

const sample: string[] = `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`.split("\n\n");

const input: string[] = readFile(`${__dirname}/input.txt`, ["\n\n"]);

// Part 1 & 2
class ClawMachine {
  private a: Coords;
  private b: Coords;
  private prize: Coords;
  public moves: { a: number; b: number };

  constructor(definition: string) {
    const [a, b, prize] = definition.split("\n").map(line => {
      const [x, y] = line.match(/[0-9]+/g)!.map(Number);
      return { x, y };
    });

    this.a = a;
    this.b = b;
    this.prize = prize;
    this.moves = this._calculateMoves();
  }

  public offsetPrize(offset: number): ClawMachine {
    this.prize = { x: this.prize.x + offset, y: this.prize.y + offset };
    this.moves = this._calculateMoves();
    return this;
  }

  private _calculateMoves(): { a: number; b: number } {
    const { a, b, prize } = this;
    const bMoves = (a.x * prize.y - prize.x * a.y) / (a.x * b.y - b.x * a.y);
    const aMoves = (prize.x - bMoves * b.x) / a.x;
    if (Number.isInteger(aMoves) && Number.isInteger(bMoves) && aMoves >= 0 && bMoves >= 0) {
      return { a: aMoves, b: bMoves };
    }
    return { a: -1, b: -1 };
  }

  get tokens(): number {
    if (this.moves.a === -1 || this.moves.b === -1) return 0;
    return 3 * this.moves.a + this.moves.b;
  }
}

// Results
const machines = input.map(definition => new ClawMachine(definition));
const offsetMachines = input.map(definition => new ClawMachine(definition).offsetPrize(OFFSET));

console.log(`Part 1: ${sum(machines.map(machine => machine.tokens))}`);
console.log(`Part 2: ${sum(offsetMachines.map(machine => machine.tokens))}`);
