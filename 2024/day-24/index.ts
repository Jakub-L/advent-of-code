import { Queue } from "@jakub-l/aoc-lib/data-structures";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// prettier-ignore
// Types & Enums
enum Gate { AND, OR, XOR }
type InitialState = Record<string, number>;
type Instruction = { gate: Gate; registerA: string; registerB: string; output: string };

// Consants
const GATE = {
  [Gate.AND]: (a: number, b: number): number => a & b,
  [Gate.OR]: (a: number, b: number): number => a | b,
  [Gate.XOR]: (a: number, b: number): number => a ^ b
};

// Inputs
const parseInitialState = (state: InitialState, rawInitialState: string): InitialState => {
  const [register, value] = rawInitialState.split(": ");
  return { ...state, [register]: Number(value) };
};

const parseInstruction = (rawInstruction: string): Instruction => {
  const [registers, output] = rawInstruction.split(" -> ");
  const [registerA, gate, registerB] = registers.split(" ");
  return { gate: Gate[gate as keyof typeof Gate], registerA, registerB, output };
};

const [rawInitialState, rawInstructions] = readFile(`${__dirname}/input.txt`, ["\n\n", "\n"]) as string[][];
// const [rawInitialState, rawInstructions] = readFile(`${__dirname}/sample.txt`, ["\n\n", "\n"]) as string[][];

const initialState = rawInitialState.reduce(parseInitialState, {});
const instructions = rawInstructions.map(parseInstruction);

// Part 1
const getWireOutput = (initialState: InitialState, instructions: Instruction[]): number => {
  const state = { ...initialState };
  const queue = new Queue<Instruction>(instructions);

  while (!queue.isEmpty) {
    const { gate, registerA, registerB, output } = queue.dequeue();
    if (registerA in state && registerB in state) {
      const [a, b] = [state[registerA], state[registerB]];
      const gateFunction = GATE[gate];
      state[output] = gateFunction(a, b);
    } else {
      queue.enqueue({ gate, registerA, registerB, output });
    }
  }

  const binaryOutput = Object.entries(state)
    .filter(([key]) => key.startsWith("z"))
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce((acc, [_, value]) => `${value}${acc}`, "");
  return parseInt(binaryOutput, 2);
};

// Results
console.log(getWireOutput(initialState, instructions));
