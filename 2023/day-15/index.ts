import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

// const input = "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7";
const input = readFile(__dirname + "/input.txt", [","]) as string[];

const hash = (str: string) => str.split("").reduce((acc, c) => (17 * (acc + c.charCodeAt(0))) % 256, 0);

console.log(sum(input.map(hash)));
