import { Queue } from "@jakub-l/aoc-lib/data-structures";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// Types & Enums
// prettier-ignore
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
const initialState = rawInitialState.reduce(parseInitialState, {});
const instructions = rawInstructions.map(parseInstruction);

// Part 1
/**
 * Processes the instructions based on the initial state and returns the state of z-wires as
 * a decimal number. This assumes that z00 is the least significant bit of the output.
 * @param {InitialState} initialState - The initial state of the registers.
 * @param {Instruction[]} instructions - The instructions to process.
 * @returns {number} The decimal representation of the z-wires.
 */
const getWireOutput = (initialState: InitialState, instructions: Instruction[]): number => {
  const state = { ...initialState };
  const queue = new Queue<Instruction>([...instructions]);

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
  // 1. Take all registers
  // 2. Filter to keep only z-wires
  // 3. Sort by the wire number
  // 4. Convert to binary string, with the least significant bit first
  const binaryOutput = Object.entries(state)
    .filter(([key]) => key.startsWith("z"))
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce((acc, [_, value]) => `${value}${acc}`, "");

  return parseInt(binaryOutput, 2);
};

// Part 2
/**
 * Checks if the string starts with any of the prefixes.
 * @param {string} str - The string to check.
 * @param {string[]} prefixes - The prefixes to check against.
 * @returns {boolean} True if the string starts with any of the prefixes, false otherwise.
 */
const startsWith = (str: string, prefixes: string[]): boolean => {
  return prefixes.some(prefix => str.startsWith(prefix));
};

/**
 * Finds the incorrectly connected gates in the circuit.
 *
 * Since the circuit is an adder, there are certain rules to the instructions, which can be used to
 * identify incorrect connections. We do not need to fix those instructions, just identify them.
 * @param {InitialState} initialState - The initial state of the registers.
 * @param {Instruction[]} instructions - The instructions to process.
 * @returns {string} The list of incorrect gates, sorted and joined by commas.
 */
const findIncorrectGates = (initialState: InitialState, instructions: Instruction[]): string => {
  const incorrect = new Set<string>();
  // Since the inputs are the x and y registers, and they have equal bit length, the maximum
  // bit number is half of the number of registers.
  const maxBit = 45;

  for (const { registerA, gate, registerB, output } of instructions) {
    // Any z-output must be an XOR gate (unless it's the last bit)
    if (startsWith(output, ["z"]) && gate !== Gate.XOR && output !== `z${maxBit}`) {
      incorrect.add(output);
    }
    // Any XOR gate must either have x, y, or z as an input or output
    if (
      gate === Gate.XOR &&
      !startsWith(output, ["x", "y", "z"]) &&
      !startsWith(registerA, ["x", "y", "z"]) &&
      !startsWith(registerB, ["x", "y", "z"])
    ) {
      incorrect.add(output);
    }
    // Any AND gate that doesn't have the least significant bits as inputs
    // must not have the output used as an input in a non-OR gate.
    if (gate === Gate.AND && ![registerA, registerB].includes("x00")) {
      for (const subInstr of instructions) {
        if ((output === subInstr.registerA || output === subInstr.registerB) && subInstr.gate !== Gate.OR) {
          incorrect.add(output);
        }
      }
    }
    // Any XOR gate must not have its output used in an OR gate.
    if (gate === Gate.XOR) {
      for (const subInstr of instructions) {
        if ((output === subInstr.registerA || output === subInstr.registerB) && subInstr.gate === Gate.OR) {
          incorrect.add(output);
        }
      }
    }
  }
  // We expect 8 incorrect gates, if we don't have that, something went wrong.
  if (incorrect.size !== 8) return "Something went wrong!";
  return [...incorrect].sort().join(",");
};

// Results
console.log(`Part 1: ${getWireOutput(initialState, instructions)}`);
console.log(`Part 2: ${findIncorrectGates(initialState, instructions)}`);