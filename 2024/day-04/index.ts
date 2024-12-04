import { readFile } from "@jakub-l/aoc-lib/input-parsing";

const sample = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`
  .split("\n")
  .map(x => x.split(""));

const input = readFile(__dirname + "/input.txt", ["\n", ""]) as string[][];

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

console.log(findXmas(input)); 
