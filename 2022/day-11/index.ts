/**
 * Solution to Day 11 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/11
 */

// INPUTS
// const monkeys: MonkeyDefinition[] = [
//   {
//     startingItems: [79, 98],
//     operation: old => old * 19,
//     testDefinition: { conditionModulus: 23, trueIndex: 2, falseIndex: 3 }
//   },
//   {
//     startingItems: [54, 65, 75, 74],
//     operation: old => old + 6,
//     testDefinition: { conditionModulus: 19, trueIndex: 2, falseIndex: 0 }
//   },
//   {
//     startingItems: [79, 60, 97],
//     operation: old => old ** 2,
//     testDefinition: { conditionModulus: 13, trueIndex: 1, falseIndex: 3 }
//   },
//   {
//     startingItems: [74],
//     operation: old => old + 3,
//     testDefinition: { conditionModulus: 17, trueIndex: 0, falseIndex: 1 }
//   }
// ];
const monkeys: MonkeyDefinition[] = [
  {
    startingItems: [65, 58, 93, 57, 66],
    operation: old => old * 7,
    testDefinition: { conditionModulus: 19, trueIndex: 6, falseIndex: 4 }
  },
  {
    startingItems: [76, 97, 58, 72, 57, 92, 82],
    operation: old => old + 4,
    testDefinition: { conditionModulus: 3, trueIndex: 7, falseIndex: 5 }
  },
  {
    startingItems: [90, 89, 96],
    operation: old => old * 5,
    testDefinition: { conditionModulus: 13, trueIndex: 5, falseIndex: 1 }
  },
  {
    startingItems: [72, 63, 72, 99],
    operation: old => old * old,
    testDefinition: { conditionModulus: 17, trueIndex: 0, falseIndex: 4 }
  },
  {
    startingItems: [65],
    operation: old => old + 1,
    testDefinition: { conditionModulus: 2, trueIndex: 6, falseIndex: 2 }
  },
  {
    startingItems: [97, 71],
    operation: old => old + 8,
    testDefinition: { conditionModulus: 11, trueIndex: 7, falseIndex: 3 }
  },
  {
    startingItems: [83, 68, 88, 55, 87, 67],
    operation: old => old + 2,
    testDefinition: { conditionModulus: 5, trueIndex: 2, falseIndex: 1 }
  },
  {
    startingItems: [64, 81, 50, 96, 82, 53, 62, 92],
    operation: old => old + 5,
    testDefinition: { conditionModulus: 7, trueIndex: 3, falseIndex: 0 }
  }
];

// UTILS
type Operation = (old: number) => number;
type TestFunction = (worry: number) => Monkey;
type TestDefinition = {
  conditionModulus: number;
  trueIndex: number;
  falseIndex: number;
};
type MonkeyDefinition = {
  startingItems: number[];
  operation: Operation;
  testDefinition: TestDefinition;
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
   */
  constructor(startingItems: number[], operation: Operation) {
    this.items = startingItems;
    this.operation = operation;
  }

  /** Processes all items in a monkey's collection */
  processItems() {
    while (this.items.length > 0) {
      const oldWorry = this.items.shift() || 0;
      const newWorry = Math.floor(this.operation(oldWorry) / 3);
      const targetMonkey = this.test(newWorry);
      targetMonkey.items.push(newWorry);
      this.inspectedItems += 1;
    }
  }
}

/** A pack of monkeys */
class Pack {
  private monkeys: Monkey[] = [];

  /**
   * Creates a new pack of monkeys
   * @param {MonkeyDefinition[]} monkeys - Definitions of all the monkeys
   */
  constructor(monkeys: MonkeyDefinition[]) {
    for (const monkey of monkeys) {
      this.monkeys.push(new Monkey(monkey.startingItems, monkey.operation));
    }
    // Once the monkeys have been created, the pointers can be created
    for (let i = 0; i < this.monkeys.length; i++) {
      this.monkeys[i].test = this.parseTest(monkeys[i].testDefinition);
    }
  }

  /**
   * Simulates the monkeys playing their game for specified number of rounds
   * @param {number} count - Number of rounds to play
   */
  playRounds(count: number) {
    for (let n = 0; n < count; n++) {
      for (const monkey of this.monkeys) monkey.processItems();
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
      return worry % def.conditionModulus === 0
        ? monkeys[def.trueIndex]
        : monkeys[def.falseIndex];
    };
  }
}

// PART 1
const pack = new Pack(monkeys);
pack.playRounds(20);

// RESULTS
console.log(`Part 1 solution: ${pack.monkeyBusiness}`);
