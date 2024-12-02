import { readFile } from "@jakub-l/aoc-lib/input-parsing";

const MIN_CHANGE = 1;
const MAX_CHANGE = 3;

type Level = number;
type Report = Level[];

const reports: Report[] = readFile(__dirname + "/input.txt", ["\n", " "], Number) as Report[];

// Part 1
/**
 * Finds whether a report is safe.
 *
 * A report is safe if:
 * - The levels are either all increasing or all decreasing.
 * - Any two adjacent levels differ by at least one and at most three.
 *
 * @param {Report} report - The report to check.
 * @returns {boolean} - Whether the report is safe.
 */
const isSafe = (report: Report): boolean => {
  let firstChange = Math.sign(report[1] - report[0]);
  for (let i = 0; i < report.length - 1; i++) {
    let diff = report[i + 1] - report[i];
    if (Math.abs(diff) > MAX_CHANGE || Math.abs(diff) < MIN_CHANGE) return false;
    if (firstChange !== Math.sign(diff)) return false;
  }
  return true;
};

// Part 2
/**
 * Checks whether a report is safe with a tolerance of one level. This means
 * a report is marked as safe if it is safe as-is, or if it would be safe
 * if any one level was removed.
 *
 * @param {Report} report - The report to check.
 * @returns {boolean} - Whether the report is safe.
 */
const isSafeWithTolerance = (report: Report): boolean => {
  const isBaseSafe = isSafe(report);
  if (isBaseSafe) return true;

  for (let i = 0; i < report.length; i++) {
    const newReport = report.toSpliced(i, 1);
    if (isSafe(newReport)) return true;
  }
  return false;
};

// Results
console.log(`Part 1: ${reports.filter(isSafe).length}`);
console.log(`Part 2: ${reports.filter(isSafeWithTolerance).length}`);
