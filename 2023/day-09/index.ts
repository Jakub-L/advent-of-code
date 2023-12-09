import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

const input = readFile(__dirname + "/input.txt", ["\n", " "], x => Number(x)) as unknown as number[][];

// const input = `0 3 6 9 12 15
// 1 3 6 10 15 21
// 10 13 16 21 30 45`
//   .split("\n")
//   .map(line => line.split(" ").map(n => parseInt(n)));

const findDifferences = (numbers: number[]): number[][] => {
  const allDifferences = [numbers];
  let previousNumbers = numbers ?? [];
  while (previousNumbers.some(n => n !== 0)) {
    const differences = [];
    for (let i = 1; i < previousNumbers.length; i++) {
      differences.push(previousNumbers[i] - previousNumbers[i - 1]);
    }
    allDifferences.push(differences);
    previousNumbers = differences;
  }

  return allDifferences;
};

const extrapolateForward = (numbers: number[]): number => {
  const differences = findDifferences(numbers);
  let nextNumber = 0;
  for (let i = differences.length - 2; i >= 0; i--) {
    nextNumber += differences[i].at(-1) ?? 0;
  }
  return nextNumber;
};

const extrapolateBackward = (numbers: number[]): number => {
  const differences = findDifferences(numbers);
  let previousNumbers = 0;
  for (let i = differences.length - 2; i >= 0; i--) {
    previousNumbers = (differences[i].at(0) ?? 0) - previousNumbers;
  }
  return previousNumbers;
};

// console.time("part1");
// console.log(sum(input.map(extrapolateForward)));
// console.timeEnd("part1");
console.log(sum(input.map(extrapolateBackward)));
