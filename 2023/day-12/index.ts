import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

const parseLine = ([pattern, counts]: string[]) => ({
  pattern,
  counts: counts.split(",").map(Number)
});

const input = (readFile(`${__dirname}/input.txt`, ["\n", " "]) as string[][]).map(parseLine);

// const input = `???.### 1,1,3
// .??..??...?##. 1,1,3
// ?#?#?#?#?#?#?#? 1,3,1,6
// ????.#...#... 4,1,1
// ????.######..#####. 1,6,5
// ?###???????? 3,2,1`
//   .split("\n")
//   .map(line => line.split(" "))
// .map(parseLine);

const countPossibilites = (pattern: string, counts: number[]): number => {
  // CHECKS
  // Check 1: No pattern left requires no counts for a match
  if (pattern.length === 0) {
    if (counts.length === 0) return 1;
    return 0;
  }

  // Check 2: No counts left, but the pattern has to have no hashes for a match
  if (counts.length === 0) return /^[^#]+$/.test(pattern) ? 1 : 0;

  // Check 3: We have to have enough pattern for the sum of all counts + one
  // dot per gap between counts
  if (pattern.length < sum(counts) + (counts.length - 1)) return 0;

  // RECURSIVE CALCULATION
  // A dot has no impact
  if (pattern[0] === ".") return countPossibilites(pattern.slice(1), counts);

  // A hash has to match with the first count
  if (pattern[0] === "#") {
    const [firstCount, ...restCounts] = counts;

    // If we hit a dot, before the end of the count, we can't build the #-run
    for (let i = 0; i < firstCount; i++) {
      if (pattern[i] === ".") return 0;
    }

    // If there's a hash at the end of the run, that means the actual run is
    // too long and there's no match.
    if (pattern[firstCount] === "#") return 0;

    // Otherwise we lop off the first count from the pattern and the counts
    // and continue the calculation we add a 1 to the slice to account for
    // the necessary gap
    return countPossibilites(pattern.slice(firstCount + 1), restCounts);
  }

  // A question mark is a wildcard, so we have to check both possibilities
  return countPossibilites(`#${pattern.slice(1)}`, counts) + countPossibilites(`.${pattern.slice(1)}`, counts);
};

console.log(
  sum(
    input.map(({ pattern, counts }) => {
      console.log(pattern);
      return countPossibilites(pattern, counts);
    })
  )
);
