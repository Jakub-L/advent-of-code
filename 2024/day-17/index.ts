// Types & enums

import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// Constants

// Input
const [rawRegisters, rawProgram] = readFile(`${__dirname}/input.txt`, ["\n\n"]) as string[];

const [sampleRegisters, sampleProgram] = `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`.split("\n\n");

// Part 1 & 2
class Computer {
  private _A: number = 0;
  private _B: number = 0;
  private _C: number = 0;
  private _instr: number = 0;
  private _program: number[] = [];
  public output: number[] = [];

  constructor(rawRegisters: string, rawProgram: string) {
    const [A, B, C] = rawRegisters.split("\n").map(line => Number(line.match(/\d+/)![0]));
    const program = rawProgram.match(/\d+/g)!.map(Number);
    this._A = A;
    this._B = B;
    this._C = C;
    this._program = program;
  }

  private _combo(n: number): number {
    if (n <= 3) return n;
    return [this._A, this._B, this._C][n - 4];
  }

  private _div(operand: number, reg: "_A" | "_B" | "_C"): void {
    this[reg] = Math.floor(this._A / Math.pow(2, this._combo(operand)));
  }

  private _xor(a: number, b: number, reg: "_A" | "_B" | "_C"): void {
    this[reg] = a ^ b;
  }

  private _adv(operand: number): void {
    this._div(operand, "_A");
    this._instr += 2;
  }

  private _bdv(operand: number): void {
    this._div(operand, "_B");
    this._instr += 2;
  }

  private _cdv(operand: number): void {
    this._div(operand, "_C");
    this._instr += 2;
  }

  private _bxl(operand: number): void {
    this._xor(this._B, operand, "_B");
    this._instr += 2;
  }

  private _bxc(operand: number): void {
    this._xor(this._B, this._C, "_B");
    this._instr += 2;
  }

  private _bst(operand: number): void {
    this._B = this._combo(operand) % 8;
    this._instr += 2;
  }

  private _jnz(operand: number): void {
    if (this._A !== 0) {
      this._instr = operand;
    } else {
      this._instr += 2;
    }
  }

  private _out(operand: number): void {
    this.output.push(this._combo(operand) % 8);
    this._instr += 2;
  }

  public run(): void {
    while (this._instr < this._program.length) {
      const opcode = this._program[this._instr];
      const operand = this._program[this._instr + 1];
      if (opcode === 0) this._adv(operand);
      if (opcode === 1) this._bxl(operand);
      if (opcode === 2) this._bst(operand);
      if (opcode === 3) this._jnz(operand);
      if (opcode === 4) this._bxc(operand);
      if (opcode === 5) this._out(operand);
      if (opcode === 6) this._bdv(operand);
      if (opcode === 7) this._cdv(operand);
    }
  }
}

// Results
const computer = new Computer(rawRegisters, rawProgram);
computer.run();
console.log(computer.output.join(","));
