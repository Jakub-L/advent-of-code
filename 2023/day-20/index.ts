import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { Queue } from "@jakub-l/aoc-lib/data-structures";
import { prod, gcd } from "@jakub-l/aoc-lib/math";

// UTILS
type Signal = 0 | 1;
type SignalDetails = { source: string; target: string; signal: Signal };

interface Module {
  name: string;
  targets: string[];
  recieveSignal(details: SignalDetails): SignalDetails[];
}

class FlipFlop implements Module {
  private _isOn: boolean = false;
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

class Conjunction implements Module {
  private _lastSignal: Record<string, Signal> = {};

  constructor(public name: string, public targets: string[]) {}

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

class Broadcaster implements Module {
  constructor(public name: string, public targets: string[]) {}

  recieveSignal(details: SignalDetails): SignalDetails[] {
    const { signal } = details;
    return this.targets.map(target => ({ source: "broadcaster", target, signal }));
  }
}

class Machine {
  private _modules: Record<string, Module> = {};
  private _inputsLookup: Record<string, string[]> = {};

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

  pushButton(n: number = 1): number {
    const signalCounts = [0, 0];
    for (let i = 0; i < n; i++) {
      const queue: Queue<SignalDetails> = new Queue();
      queue.enqueue({ source: "button", target: "broadcaster", signal: 0 });
      while (!queue.isEmpty) {
        const details = queue.dequeue()!;
        signalCounts[details.signal]++;
        if (["mk", "fp", "xt", "zc"].includes(details.source) && details.signal === 1) {
          console.log(details, i);
        }
        const newSignals = this._modules[details.target]?.recieveSignal(details) ?? [];
        for (const newSignal of newSignals) queue.enqueue(newSignal);
      }
    }
    return prod(signalCounts);
  }

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
        const { source, signal } = details;
        if (source in lastHighSignal && signal === 1) {
          if (lastHighSignal[source] !== -1) {
            loopLengths[source] = buttonPresses - lastHighSignal[source];
          } else {
            lastHighSignal[source] = buttonPresses;
          }
        }
        const newSignals = this._modules[details.target]?.recieveSignal(details) ?? [];
        for (const newSignal of newSignals) queue.enqueue(newSignal);
      }
      buttonPresses++;
    }
    return Object.values(loopLengths).reduce((res, loop) => Math.abs(res * loop) / gcd(res, loop), 1);
  }
}

// INPUT PROCESSING
const input = readFile(__dirname + "/input.txt", ["\n", " -> "]) as string[][];
const machine = new Machine(input);

console.log(machine.findTurnOnTime());
