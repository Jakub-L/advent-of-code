import { readFile } from "@jakub-l/aoc-lib/input-parsing";

const input: string[][] = readFile(__dirname + "/input.txt", ["\n", ""]) as string[][];

// Part 1
/**
 * Counts the number of occurences of "XMAS" in the wordsearch. The word can be in
 * any direction and forwards or backwards. The same letter can be used multiple times.
 *
 * @param {string[][]} wordsearch - 2D array of characters
 * @returns {number} - number of occurences of "XMAS" in the wordsearch
 */
const findXmas = (wordsearch: string[][]): number => {
  // prettier-ignore
  const directions = [
    [[1, 0], [2, 0], [3, 0]],
    [[1, 1], [2, 2], [3, 3]],
    [[0, 1], [0, 2], [0, 3]],
    [[-1, 1], [-2, 2], [-3, 3]],
    [[-1, 0], [-2, 0], [-3, 0]],
    [[-1, -1], [-2, -2], [-3, -3]],
    [[0, -1], [0, -2], [0, -3]],
    [[1, -1], [2, -2], [3, -3]]    
  ]

  let result = 0;
  for (let i = 0; i < wordsearch.length; i++) {
    for (let j = 0; j < wordsearch[i].length; j++) {
      if (wordsearch[i][j] !== "X") continue;
      for (const direction of directions) {
        result += direction.every(([dx, dy], k) => wordsearch[i + dx]?.[j + dy] === "XMAS"[k + 1]) ? 1 : 0;
      }
    }
  }
  return result;
};

// Part 2
/**
 * Counts the number of occurences of the MAS-cross.
 *
 * The cross is defined as:
 * M   S
 *   A
 * M   S
 * With either the diagonals being either forwards or backwards.
 * The cross requires both diagonals to be valid and each letter can
 * be used multiple times.
 *
 * @param {string[][]} wordsearch - 2D array of characters
 * @returns {number} - number of occurences of the MAS cross in the wordsearch
 */
const findCrossMas = (wordsearch: string[][]): number => {
  // prettier-ignore
  const corners = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

  let result = 0;
  for (let i = 0; i < wordsearch.length; i++) {
    for (let j = 0; j < wordsearch[i].length; j++) {
      if (wordsearch[i][j] === "A") {
        const [tl, tr, bl, br] = corners.map(([dx, dy]) => wordsearch[i + dx]?.[j + dy]);
        const leftDiagonalValid = (tl === "M" && br === "S") || (tl === "S" && br === "M");
        const rightDiagonalValid = (tr === "M" && bl === "S") || (tr === "S" && bl === "M");
        result += leftDiagonalValid && rightDiagonalValid ? 1 : 0;
      }
    }
  }
  return result;
};

// Results
console.log("Part 1:", findXmas(input));
console.log("Part 2:", findCrossMas(input));
