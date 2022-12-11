/**
 * Solution to Day 11 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/11
 * 
 * 
 * Part 2 of this puzzle uses this identity:
 *    a mod n = (a mod k*n) mod n; where k is any positive integer.
 * 
 * What this means is rather than looking at (worry mod n) for each monkey's test, we 
 * can instead look at (worry mod k*n) mod n and the result will be the same. At the 
 * same time, this allowsus to keep the stored value (worry mod k*n) smaller than 
 * just (worry mod n).
 * 
 * Obviously, (k*n) has to be a number that divides n. If we use k*n such that it divides
 * every monkey's modulus check, we can just store (worry mod k*n). The simplest way
 * to find (k*n) such that it divides all monkeys' moduli is to multiply them together.
 * 
 * I also manually parsed the monkey inputs rather than writing a function that could
 * interpret the functions, since there's only 8 of them.
 */

// INPUTS
const monkeys: MonkeyDefinition[] = [
  {
    startingItems: [65, 58, 93, 57, 66],
    operation: old => old * 7,
    testDef: { mod: 19, trueIndex: 6, falseIndex: 4 }
  },
  {
    startingItems: [76, 97, 58, 72, 57, 92, 82],
    operation: old => old + 4,
    testDef: { mod: 3, trueIndex: 7, falseIndex: 5 }
  },
  {
    startingItems: [90, 89, 96],
    operation: old => old * 5,
    testDef: { mod: 13, trueIndex: 5, falseIndex: 1 }
  },
  {
    startingItems: [72, 63, 72, 99],
    operation: old => old * old,
    testDef: { mod: 17, trueIndex: 0, falseIndex: 4 }
  },
  {
    startingItems: [65],
    operation: old => old + 1,
    testDef: { mod: 2, trueIndex: 6, falseIndex: 2 }
  },
  {
    startingItems: [97, 71],
    operation: old => old + 8,
    testDef: { mod: 11, trueIndex: 7, falseIndex: 3 }
  },
  {
    startingItems: [83, 68, 88, 55, 87, 67],
    operation: old => old + 2,
    testDef: { mod: 5, trueIndex: 2, falseIndex: 1 }
  },
  {
    startingItems: [64, 81, 50, 96, 82, 53, 62, 92],
    operation: old => old + 5,
    testDef: { mod: 7, trueIndex: 3, falseIndex: 0 }
  }
];

// UTILS
type Operation = (old: number) => number;
type TestFunction = (worry: number) => Monkey;
type TestDefinition = {
  mod: number;
  trueIndex: number;
  falseIndex: number;
};
type MonkeyDefinition = {
  startingItems: number[];
  operation: Operation;
  testDef: TestDefinition;
};

/** A single monkey */
class Monkey {
  items: number[];
  operation: Operation;
  test: TestFunction = () => this;
  inspectedItems: number = 0;

  /**
   * Creates a new monkey
   * @param {Number} startingItems - Worry levels for the inital items held by the monkey
   * @param {Operation} operation - Function defining how inspecting the item affects the
   *      worry levels
   * @param {boolean} dividesBy3 - Whether the worry level is divided by 3 after every inspection
   */
  constructor(startingItems: number[], operation: Operation) {
    this.items = Array.from(startingItems);
    this.operation = operation;
  }

  /** Processes all items in a monkey's collection */
  processItems(modulus: number = 0) {
    while (this.items.length > 0) {
      const oldWorry = this.items.shift() || 0;
      const newWorry =
        modulus === 0
          ? Math.floor(this.operation(oldWorry) / 3)
          : this.operation(oldWorry) % modulus;
      const targetMonkey = this.test(newWorry);
      targetMonkey.items.push(newWorry);
      this.inspectedItems += 1;
    }
  }
}

/** A pack of monkeys */
class Pack {
  private monkeys: Monkey[] = [];
  private modulus: number = 0;

  /**
   * Creates a new pack of monkeys
   * @param {MonkeyDefinition[]} monkeys - Definitions of all the monkeys
   * @param {boolean} [divideBy3=true] - Whether the worry level is divided by three
   *    after every monkey's inspection
   */
  constructor(monkeys: MonkeyDefinition[], divideBy3: boolean = true) {
    for (const monkey of monkeys) {
      this.monkeys.push(new Monkey(monkey.startingItems, monkey.operation));
    }
    // Once the monkeys have been created, the pointers can be created
    for (let i = 0; i < this.monkeys.length; i++) {
      this.monkeys[i].test = this.parseTest(monkeys[i].testDef);
    }
    if (!divideBy3) this.modulus = monkeys.reduce((acc, m) => acc * m.testDef.mod, 1);
  }

  /**
   * Simulates the monkeys playing their game for specified number of rounds
   * @param {number} count - Number of rounds to play
   */
  playRounds(count: number) {
    for (let n = 0; n < count; n++) {
      for (const monkey of this.monkeys) monkey.processItems(this.modulus);
    }
  }

  /** Product of two busiest monkey's handled items */
  get monkeyBusiness(): number {
    return this.monkeys
      .map(monkey => monkey.inspectedItems)
      .sort((a, b) => b - a)
      .slice(0, 2)
      .reduce((acc, e) => acc * e, 1);
  }

  /**
   * Converts a test from a object definition to a function
   * @param {TestDefinition} def - Definition of the testing function
   * @returns {TestFunction} The test as a function
   */
  private parseTest(def: TestDefinition): TestFunction {
    const monkeys = this.monkeys;
    return function (worry: number): Monkey {
      return worry % def.mod === 0 ? monkeys[def.trueIndex] : monkeys[def.falseIndex];
    };
  }
}

// PART 1
const firstPack = new Pack(monkeys);
firstPack.playRounds(20);

// PART 2
const secondPack = new Pack(monkeys, false);
secondPack.playRounds(10000);

// // RESULTS
console.log(`Part 1 solution: ${firstPack.monkeyBusiness}`);
console.log(`Part 2 solution: ${secondPack.monkeyBusiness}`);
