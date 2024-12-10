import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

type DiskMap = Array<number>;
type Block = Array<number | null>;
type File = {
  pos: number;
  size: number;
  id: number | null;
};

const sample: DiskMap = `2333133121414131402`.split("").map(Number);
const input: DiskMap = readFile(`${__dirname}/input.txt`, [""], Number);

const mapToBlock = (diskMap: DiskMap): Block => {
  console.log(diskMap.length);
  let id = 0;
  return diskMap.reduce((block, n, i) => {
    const value = i % 2 ? null : id++;
    return block.concat(Array(n).fill(value));
  }, [] as Block);
};

const compressBlock = (blocks: Block): Block => {
  const compressed: Block = structuredClone(blocks);
  for (let i = 0, j = blocks.length - 1; i <= j; i++) {
    const data = compressed[i];
    if (data === null) {
      while (compressed[j] === null) j--;
      compressed[i] = compressed[j];
      compressed[j--] = null;
    }
  }
  return compressed;
};

const blockChecksum = (block: Block): number => {
  return sum(block.map((n, i) => (n === null ? 0 : n * i)));
};

// Part 2
const diskToFiles = (disk: DiskMap): Array<File> => {
  let pos = 0;
  let id = 0;
  return disk.map((size, i) => {
    const file = { pos, size, id: i % 2 ? null : id++ };
    pos += size;

    return file;
  });
};

const compressFiles = (files: Array<File>): Array<File> => {
  let compressed: Array<File> = structuredClone(files);

  for (let i = compressed.length - 1; i >= 0; i -= 2) {
    const used = compressed[i];
    for (let j = 1; j < compressed.length; j += 2) {
      const free = compressed[j];
      if (free.pos <= used.pos && free.size >= used.size) {
        used.pos = free.pos;
        free.pos += used.size;
        free.size -= used.size;
      }
    }
  }
  return compressed.filter(f => f.size !== 0).sort((a, b) => a.pos - b.pos);
};

const fileChecksum = (files: Array<File>): number => {
  let sum = 0;
  for (const file of files) {
    if (file.id !== null) {
      sum += (file.id * file.size * (2 * file.pos + file.size - 1)) / 2;
    }
  }
  return sum;
};

console.log(
  fileChecksum(compressFiles(diskToFiles(input)))
  // .reduce((block, f) => block.concat(Array(f.size).fill(f.id)), [] as Block)
  // .map(n => (n === null ? "." : n))
  // .join("")
);
