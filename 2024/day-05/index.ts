import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { intersection } from "@jakub-l/aoc-lib/collections";
import { sum } from "@jakub-l/aoc-lib/math";

const sample = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

type RuleLookup = Record<number, Set<number>>;

const [rawRules, rawUpdates]: [string, string] = readFile(__dirname + "/input.txt", ["\n\n"]);

const rules: RuleLookup = parseRules(rawRules);
const updates: number[][] = rawUpdates.split("\n").map(update => update.split(",").map(Number));

function parseRules(rawRules: string): RuleLookup {
  const rules: RuleLookup = {};
  for (const rule of rawRules.split("\n")) {
    const [firstPage, secondPage] = rule.split("|").map(Number);
    if (!rules[firstPage]) rules[firstPage] = new Set();
    rules[firstPage].add(secondPage);
  }
  return rules;
}

function isUpdateValid(update: number[], rules: RuleLookup): boolean {
  const seen: Set<number> = new Set();
  for (const page of update) {
    const pageRules = rules[page] ?? new Set();
    if (intersection(seen, pageRules).size > 0) return false;
    seen.add(page);
  }
  return true;
}

function getMiddleNumber(arr: number[]): number {
  return arr[Math.floor(arr.length / 2)];
}

console.log(sum(updates.filter(update => isUpdateValid(update, rules)).map(getMiddleNumber)));
// console.log(sortUpdate([75, 97, 47, 61, 53], rules));
