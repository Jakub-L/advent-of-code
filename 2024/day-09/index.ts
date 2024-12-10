import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

type DiskMap = Array<number>;
type FileBlock = Array<number | null>;

const sample: DiskMap = `2333133121414131402`.split("").map(Number);
const input: DiskMap = readFile(`${__dirname}/input.txt`, [""], Number);

const mapToBlock = (diskMap: DiskMap): FileBlock => {
  console.log(diskMap.length);
  let id = 0;
  return diskMap.reduce((block, n, i) => {
    const value = i % 2 ? null : id++;
    return block.concat(Array(n).fill(value));
  }, [] as FileBlock);
};

const compress = (disk: FileBlock): FileBlock => {
  const compressed: FileBlock = structuredClone(disk);
  for (let i = 0, j = disk.length - 1; i <= j; i++) {
    const data = compressed[i];
    if (data === null) {
      while (compressed[j] === null) j--;
      compressed[i] = compressed[j];
      compressed[j--] = null;
    }
  }
  return compressed;
};

const checksum = (disk: FileBlock): number => {
  return sum(disk.map((n, i) => (n === null ? 0 : n * i)));
};

const blockToString = (disk: FileBlock): string => disk.map(n => (n === null ? "." : n)).join("");

// console.log(compress(sample).join(""));
console.log(checksum(compress(mapToBlock(input))));

// 00...111...2...333.44.5555.6666.777.888899
// 00...111...2...333.44.5555.6666.777.888899
//
// 009981118882777333644655556.6.............
// 0099811188827773336446555566..............
