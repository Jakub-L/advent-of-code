import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

type Equation = {
  target: number;
  elements: number[];
};

// Input parsing
const parseLine = (line: string): Equation => {
  const [rawTarget, rawElements] = line.split(": ");
  return {
    target: Number(rawTarget),
    elements: rawElements.split(" ").map(e => parseInt(e))
  };
};

const sample = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`
  .split("\n")
  .map(parseLine);

const input: Equation[] = readFile(__dirname + "/input.txt", ["\n"], parseLine) as Equation[];

// Parts 1 & 2
const add = (a: number, b: number): number => a + b;
const mul = (a: number, b: number): number => a * b;
const con = (a: number, b: number): number => Number(`${a}${b}`);

const isValid = (equation: Equation, operations = [add, mul]): boolean => {
  const { target, elements } = equation;
  let current = [elements[0]];
  for (let i = 1; i < elements.length; i++) {
    const n = elements[i];
    current = current.flatMap(c => operations.map(op => op(c, n)));
  }
  return current.includes(target);
};

console.log(sum(input.filter(eq => isValid(eq)).map(e => e.target)));
console.log(sum(input.filter(eq => isValid(eq, [add, mul, con])).map(e => e.target)));
