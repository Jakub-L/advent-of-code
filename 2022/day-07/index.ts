/**
 * Solution to Day 7 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/7
 */
import { readInput } from '../utils';

// INPUTS
const terminal: string[][] = readInput('./day-07/input.txt').map(row => row.split(' '));

// UTILS
/** A single file (leaf of the tree) */
class File {
  name: string;
  size: number;
  parent: Directory;

  /**
   * Creates a new File
   * @param {number} name - Name of the file
   * @param {number} size - Size of the file
   * @param {Directory} parent - Directory within which the file lives
   */
  constructor(name: string, size: number, parent: Directory) {
    this.name = name;
    this.size = size;
    this.parent = parent;
  }
}

/** A directory (a non-leaf node of the tree) */
class Directory {
  name: string;
  parent: Directory | null;
  children: (File | Directory)[];

  /**
   * Creates a new Directory
   * @param {number} name - Name of the file
   * @param {Directory} parent - Directory within which the file lives
   */
  constructor(name: string, parent?: Directory) {
    this.name = name;
    this.parent = parent || null;
    this.children = [];
  }

  /** The size of the directory (sum of sizes of its children) */
  get size(): number {
    return this.children.reduce((sum, child) => sum + child.size, 0);
  }

  /**
   * Finds the directory structure using absolute directory paths
   * @param {number} [path=''] - The initial path of the directory
   * @returns {Object.<string, number>} Object of directory paths and their sizes
   */
  getDirectories(path: string = ''): { [index: string]: number } {
    let dirs = { [`${path}/${this.name}`]: this.size };
    for (const child of this.children) {
      if (child instanceof Directory) {
        dirs = { ...dirs, ...child.getDirectories(`${path}/${this.name}`) };
      }
    }
    return dirs;
  }
}

/** A Filesystem of directories and files */
class Filesystem {
  root: Directory;
  current: Directory;

  /**
   * Creates a new filesystem and parses a set of instructions that define its structure
   * @param {string[]} terminalOutput - Printout from a terminal, split by line and lines
   *    split by space.
   */
  constructor(terminalOutput: string[][]) {
    const root = new Directory('home');
    this.root = root;
    this.current = root;
    for (const line of terminalOutput) this.parseLine(line);
  }

  /**
   * Parses a single line from a terminal printout
   * @param {string[]} line - Line from the terminal, split by spaces
   */
  parseLine(line: string[]) {
    if (line[0] === '$' && line[1] === 'cd') {
      // $ cd <directory name>
      if (line[2] === '/') this.current = this.root;
      else if (line[2] === '..') this.current = this.current.parent || this.root;
      else {
        const newDir = this.current.children.find(child => child.name === line[2]);
        if (!(newDir instanceof Directory)) throw Error();
        this.current = newDir;
      }
    } else if (line[0] === 'dir') {
      // Create directory
      const [_, directoryName] = line;
      const directory = new Directory(directoryName, this.current);
      this.current.children.push(directory);
    } else if (!isNaN(Number(line[0]))) {
      // Starts with a number - file
      const [fileSize, fileName] = line;
      const file = new File(fileName, Number(fileSize), this.current);
      this.current.children.push(file);
    }
  }

  /** List of directories in a Filesystem and their sizes */
  get directories() {
    return this.root.getDirectories();
  }
}

// PART 1
/**
 * Finds all the directories in a filesystem and sums the sizes of ones smaller than a
 * specified limit.
 * @param {Filesystem} fileSystem - File structure to analyse
 * @param {number} [maxSize=Infinity] - Maximum directory size to sum
 * @returns {number} The sum of the sizes of all the directories smaller than maxSize
 */
const findSumOfSizes = (fileSystem: Filesystem, maxSize: number = Infinity): number =>
  Object.values(fileSystem.directories).reduce(
    (acc, size) => acc + (size <= maxSize ? size : 0),
    0
  );

// PART 2
/**
 * Finds the size of the smallest directory that would need to be removed to make space
 * for an update.
 * @param {Filesystem} fileSystem - File structure to analyse
 * @param {number} minSpace - Size required for update
 * @param {number} diskSpace - Total disk space
 * @returns {number} Size of the directory to be deleted
 */
const findDirectoryToRemove = (
  fileSystem: Filesystem,
  minSpace: number = 30000000,
  diskSpace: number = 70000000
): any => {
  const directories = fileSystem.directories;
  const target = minSpace - (diskSpace - directories['/home']);
  return Object.values(directories)
    .sort((a, b) => a - b)
    .find(size => size >= target);
};

// RESULTS
const fileSystem = new Filesystem(terminal);
console.log(`Part 1 solution: ${findSumOfSizes(fileSystem, 100000)}`);
console.log(`Part 2 solution: ${findDirectoryToRemove(fileSystem)}`);
