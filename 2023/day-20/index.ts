import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { Queue } from "@jakub-l/aoc-lib/data-structures";
import { prod, gcd } from "@jakub-l/aoc-lib/math";

// UTILS
type Signal = 0 | 1;
type SignalDetails = { source: string; target: string; signal: Signal };
interface Module {
  /** The identifier of the module, without a type prefix */
  name: string;
  /** The identifiers of modules to which this module sends signals */
  targets: string[];
  /**
   * Processes a signal and returns the signals that should be sent to the targets
   * @param {SignalDetails} details - The details of the incoming signal
   * @returns {SignalDetails[]} The outgoing signals sent by this module
   */
  recieveSignal(details: SignalDetails): SignalDetails[];
}

/** A Flip-flop module */
class FlipFlop implements Module {
  /** Whether the module is currently on */
  private _isOn: boolean = false;

  /**
   * Creates a new flip-flop module
   * @param {string} name - The identifier of the module, without a type prefix ("%")
   * @param {string} targets - The identifiers of modules to which this module sends signals
   */
  constructor(public name: string, public targets: string[]) {}

  recieveSignal(details: SignalDetails): SignalDetails[] {
    const { signal } = details;
    if (signal === 0) {
      this._isOn = !this._isOn;
      const sentSignal = this._isOn ? 1 : 0;
      return this.targets.map(target => ({ source: this.name, target, signal: sentSignal }));
    }
    return [];
  }
}

/** A conjunction module */
class Conjunction implements Module {
  /** The last signal received from each input */
  private _lastSignal: Record<string, Signal> = {};

  /**
   * Creates a new conjunction module
   * @param {string} name - The identifier of the module, without a type prefix ("&")
   * @param {string} targets - The identifiers of modules to which this module sends signals
   */
  constructor(public name: string, public targets: string[]) {}

  /**
   * Sets the inputs of the conjunction module
   * @param {string[]} names - The identifiers of the input modules
   */
  setInputs(names: string[]) {
    this._lastSignal = names.reduce((acc, name) => ({ ...acc, [name]: 0 }), {});
  }

  recieveSignal(details: SignalDetails): SignalDetails[] {
    const { source, signal } = details;
    this._lastSignal[source] = signal;
    const allInputsHigh = Object.values(this._lastSignal).every(signal => signal === 1);
    return this.targets.map(target => ({ source: this.name, target, signal: allInputsHigh ? 0 : 1 }));
  }
}

/** A broadcaster module */
class Broadcaster implements Module {
  /**
   * Creates a new conjunction module
   * @param {string} name - The identifier of the module. Must be "broadcaster"
   * @param {string} targets - The identifiers of modules to which this module sends signals
   */
  constructor(public name: string, public targets: string[]) {}

  recieveSignal(details: SignalDetails): SignalDetails[] {
    const { signal } = details;
    return this.targets.map(target => ({ source: "broadcaster", target, signal }));
  }
}

/** A machine with connected modules */
class Machine {
  /** The modules in the machine */
  private _modules: Record<string, Module> = {};
  /** A lookup of module inputs for each module */
  private _inputsLookup: Record<string, string[]> = {};

  /**
   * Creates a new machine
   * @param {string[][]} configuration - The configuration of the machine, in the format [name, targets],
   *       where targets is a comma-space-separated (", ") list of module names.
   */
  constructor(configuration: string[][]) {
    for (const module of configuration) {
      const [name, targetString] = module;
      const targets = targetString.split(", ");
      for (const target of targets) {
        this._inputsLookup[target] = [
          ...(this._inputsLookup[target] || []),
          name === "broadcaster" ? "broadcaster" : name.slice(1)
        ];
      }
      if (name === "broadcaster") this._modules[name] = new Broadcaster(name, targets);
      else if (name.startsWith("%")) this._modules[name.slice(1)] = new FlipFlop(name.slice(1), targets);
      else if (name.startsWith("&")) this._modules[name.slice(1)] = new Conjunction(name.slice(1), targets);
    }
    for (const module of Object.values(this._modules)) {
      if (module instanceof Conjunction) module.setInputs(this._inputsLookup[module.name]);
    }
  }

  /**
   * Pushes the button on the machine and counts the number of signals of each type
   * @param {number} [n=1] - The number of times to push the button. Defaults to 1.
   * @returns {number} The product of the number of high and low signals
   */
  pushButton(n: number = 1): number {
    const signalCounts = [0, 0];
    for (let i = 0; i < n; i++) {
      const queue: Queue<SignalDetails> = new Queue();
      queue.enqueue({ source: "button", target: "broadcaster", signal: 0 });
      while (!queue.isEmpty) {
        const details = queue.dequeue()!;
        signalCounts[details.signal]++;
        for (const newSignal of this._modules[details.target]?.recieveSignal(details) ?? []) queue.enqueue(newSignal);
      }
    }
    return prod(signalCounts);
  }

  /**
   * Finds how many button presses it takes for the target module to recieve a low signal.
   *
   * Works under an assumption that the modules feeding the target are all conjunction modules
   * which are fed by other conjunction modules, for at least one level. The button is then
   * pressed until each of the feeding modules sends a high signal twice.
   *
   * These values can be used to calculate the loop lengths for each of the feeding modules,
   * and the lowest common multiple of these loop lengths is the number of button presses
   * required for the target to recieve a low signal.
   *
   * The assumptions are correct for the input, but it can't be guaranteed to be true for
   * all users' inputs.
   * @param {string} [target="rx"] - The identifier of the target module
   * @returns {number} The number of button presses required for the target to recieve a low signal
   */
  findTurnOnTime(target = "rx"): number {
    let startModules = this._inputsLookup[target];
    while (startModules.length === 1) startModules = startModules.flatMap(module => this._inputsLookup[module]);
    const lastHighSignal: Record<string, number> = startModules.reduce((acc, module) => ({ ...acc, [module]: -1 }), {});
    const loopLengths: Record<string, number> = { ...lastHighSignal };
    let buttonPresses = 0;

    while (Object.values(loopLengths).some(loop => loop === -1)) {
      const queue: Queue<SignalDetails> = new Queue();
      queue.enqueue({ source: "button", target: "broadcaster", signal: 0 });
      while (!queue.isEmpty) {
        const details = queue.dequeue()!;
        if (details.source in lastHighSignal && details.signal === 1) {
          if (lastHighSignal[details.source] !== -1) {
            loopLengths[details.source] = buttonPresses - lastHighSignal[details.source];
          } else lastHighSignal[details.source] = buttonPresses;
        }
        for (const newSignal of this._modules[details.target]?.recieveSignal(details) ?? []) queue.enqueue(newSignal);
      }
      buttonPresses++;
    }
    return Object.values(loopLengths).reduce((res, loop) => Math.abs(res * loop) / gcd(res, loop), 1);
  }
}

// INPUT PROCESSING
const input = readFile(__dirname + "/input.txt", ["\n", " -> "]) as string[][];
const machine = new Machine(input);

// RESULTS
console.log(`Part 1: ${machine.pushButton(1000)}`);
console.log(`Part 2: ${machine.findTurnOnTime()}`);
