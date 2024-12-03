import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum, prod } from "@jakub-l/aoc-lib/math";

const sample = "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))";

type Multiplication = [number, number];

const input = readFile(__dirname + "/input.txt", []) as string;

const getMultiplications = (input: string): Array<Multiplication> => {
  return input.match(/mul\((\d+),(\d+)\)/g)?.map(
    str =>
      str
        .match(/(\d+),(\d+)/)
        ?.slice(1, 3)
        .map(Number) as Multiplication
  ) || [];
};

const getResult = (multiplications: Array<Multiplication>): number => {
  return sum(multiplications.map(prod))
}


// console.log(input)
console.log(getResult(getMultiplications(input)));
