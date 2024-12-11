import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

type DiskMap = Array<number>;
type Block = Array<number | null>;
type File = {
  pos: number;
  size: number;
  id: number | null;
};

const input: DiskMap = readFile(`${__dirname}/input.txt`, [""], Number);

// Part 1
/**
 * Converts a DiskMap into a Block by mapping each element to a sequence of IDs.
 *
 * @param {DiskMap} diskMap - An array of numbers representing the disk map.
 * @returns {Block} A Block array where each element is either a unique ID or null, based on the index.
 */
const mapToBlock = (diskMap: DiskMap): Block => {
  let id = 0;
  return diskMap.reduce((block, n, i) => {
    const value = i % 2 ? null : id++;
    return block.concat(Array(n).fill(value));
  }, [] as Block);
};

/**
 * Compresses a Block by moving all null values to the end of the array.
 *
 * @param {Block} blocks - An array of numbers and nulls.
 * @returns {Block} A compressed Block array where all null values are at the end.
 */
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

/**
 * Calculates the checksum of a Block by summing the product of each element and its index.
 *
 * @param {Block} block - A Block array.
 * @returns {number} The checksum of the Block.
 */
const blockChecksum = (block: Block): number => {
  return sum(block.map((n, i) => (n === null ? 0 : n * i)));
};

// Part 2
/**
 * Converts a DiskMap into an array of Files.
 *
 * @param {DiskMap} disk - An array of numbers representing the disk map.
 * @returns {Array<File>} An array of Files.
 */
const diskToFiles = (disk: DiskMap): Array<File> => {
  let pos = 0;
  let id = 0;
  return disk.map((size, i) => {
    const file = { pos, size, id: i % 2 ? null : id++ };
    pos += size;

    return file;
  });
};

/**
 * Compresses an array of Files by moving all files to the beginning of the array.
 *
 * @param {Array<File>} files - An array of Files.
 * @returns {Array<File>} A compressed array of Files where all files are at the beginning.
 */
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

/**
 * Calculates the checksum of an array of Files by summing the product of each element and its index.
 *
 * @param {Array<File>} files - An array of Files.
 * @returns {number} The checksum of the Files.
 */
const fileChecksum = (files: Array<File>): number => {
  let sum = 0;
  for (const file of files) {
    if (file.id !== null) {
      sum += (file.id * file.size * (2 * file.pos + file.size - 1)) / 2;
    }
  }
  return sum;
};

// Results
console.log(blockChecksum(compressBlock(mapToBlock(input))));
console.log(fileChecksum(compressFiles(diskToFiles(input))));
