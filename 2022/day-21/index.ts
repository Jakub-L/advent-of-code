/**
 * Solution to Day 21 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/21
 */
import { readInput } from '../utils';

// INPUTS
const rawMonkeys = readInput('./day-21/input.txt');
// const rawMonkeys = `root: pppw + sjmn
// dbpl: 5
// cczh: sllz + lgvd
// zczc: 2
// ptdq: humn - dvpt
// dvpt: 3
// lfqf: 4
// humn: 5
// ljgn: 2
// sjmn: drzm * dbpl
// sllz: 4
// pppw: cczh / lfqf
// lgvd: ljgn * ptdq
// drzm: hmdt - zczc
// hmdt: 32`.split('\n');

// UTILS
type Operation = (a: number, b: number) => number;
type BaseMonkey = number;
type ComplexMonkey = [string, string, Operation];
type Monkeys = { [index: string]: BaseMonkey | ComplexMonkey };

// PART 1
const operations: { [index: string]: Operation } = {
  '+': (a: number, b: number) => a + b,
  '-': (a: number, b: number) => a - b,
  '/': (a: number, b: number) => a / b,
  '*': (a: number, b: number) => a * b
};

const parseInput = (acc: Monkeys, monkey: string): Monkeys => {
  const [name, job] = monkey.split(': ');
  if (isNaN(Number(job))) {
    const [monkeyA, operand, monkeyB] = job.split(' ');
    return { ...acc, [name]: [monkeyA, monkeyB, operations[operand]] };
  }
  return { ...acc, [name]: Number(job) };
};

const processedMonkeys: Monkeys = rawMonkeys.reduce(parseInput, {});

// PART 1
const calculate = (name: string, monkeys: Monkeys): number => {
  const value = monkeys[name];
  if (typeof value === 'number') return value as number;
  const [monkeyA, monkeyB, func] = value as ComplexMonkey;
  return func(calculate(monkeyA, monkeys), calculate(monkeyB, monkeys));
};



// RESULTS
console.log(`Solution for Part 1: ${calculate('root', processedMonkeys)}`);
