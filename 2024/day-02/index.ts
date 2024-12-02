import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { report } from "process";

const reports: number[][] = readFile(__dirname + "/input.txt", ["\n", " "], Number) as number[][];

const isSafe = (report: number[]): boolean => {
  let prevSign = Math.sign(report[1] - report[0]);
  for (let i = 0; i < report.length - 1; i++) {
    let diff = report[i + 1] - report[i];
    if (Math.abs(diff) > 3 || Math.abs(diff) < 1) return false;
    if (prevSign !== Math.sign(diff)) return false;
  }
  return true;
};

const isSafeWithTolerance = (report: number[]): boolean => {
  const isBaseSafe = isSafe(report);
  if (isBaseSafe) return true;

  for (let i = 0; i < report.length; i++) {
    const newReport = [...report.slice(0, i), ...report.slice(i + 1)];
    if (isSafe(newReport)) return true;
  }
  return false;
};

console.log(reports.filter(isSafe).length);
console.log(reports.filter(isSafeWithTolerance).length);
