import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { prod, sum } from "@jakub-l/aoc-lib/math";

const [workflowStrings, partStrings] = readFile(__dirname + "/input.txt", ["\n\n", "\n"]) as string[][];

// const [workflowStrings, partStrings] = `px{a<2006:qkq,m>2090:A,rfg}
// pv{a>1716:R,A}
// lnx{m>1548:A,A}
// rfg{s<537:gd,x>2440:R,A}
// qs{s>3448:A,lnx}
// qkq{x<1416:A,crn}
// crn{x>2662:A,R}
// in{s<1351:px,qqz}
// qqz{s>2770:qs,m<1801:hdj,R}
// gd{a>3333:R,R}
// hdj{m>838:A,pv}

// {x=787,m=2655,a=1222,s=2876}
// {x=1679,m=44,a=2067,s=496}
// {x=2036,m=264,a=79,s=2244}
// {x=2461,m=1339,a=466,s=291}
// {x=2127,m=1623,a=2188,s=1013}`
//   .split("\n\n")
//   .map(x => x.split("\n"));

type Field = "x" | "m" | "a" | "s";
type Part = { x: number; m: number; a: number; s: number; status: "A" | "R" | null };
type Range = { x: [number, number]; m: [number, number]; a: [number, number]; s: [number, number] };
type Condition = { field: Field; operator: string; value: number; target: string };
type Workflow = { name: string; conditions?: Condition[]; fallback?: string };

const parsePart = (part: string): Part => {
  const [x, m, a, s] = part.match(/\d+/g)!.map(Number);
  return { x, m, a, s, status: null };
};

const getPartsRatings = (parts: Part[]): number => {
  return sum(parts.filter(p => p.status === "A").map(p => p.x + p.m + p.a + p.s));
};

class Process {
  _workflows: Map<string, Workflow> = new Map();

  constructor(workflowStrings: string[]) {
    for (const workflowString of workflowStrings) {
      const [name] = workflowString.split(/{|}/);
      this._workflows.set(name, { name });
    }

    for (const workflowString of workflowStrings) {
      const [name, conditionString] = workflowString.split(/{|}/);
      const conditions = conditionString.split(",");
      const fallback = conditions.pop()!;
      this._workflows.set(name, {
        name,
        conditions: conditions.map(this._parseCondition),
        fallback
      });
    }
  }

  processPart = (part: Part): Part => {
    let workflow = this._workflows.get("in")!;
    while (part.status === null) {
      let target = workflow.fallback!;
      for (const condition of workflow.conditions!) {
        if (this._evaluateCondition(condition, part)) {
          target = condition.target!;
          break;
        }
      }
      if (target === "A" || target === "R") return { ...part, status: target };
      else workflow = this._workflows.get(target)!;
    }
    return part;
  };

  getPossiblePasses = (workflow: Workflow, range: Range): number => {
    const { conditions = [], fallback = "R" } = workflow;
    let sum = 0;
    for (const condition of conditions) {
      const [passingRange, failingRange] = this._applyConditionToRange(condition, range);
      if (condition.target === "A") sum += this._countInRange(passingRange);
      else if (condition.target !== "R") {
        const targetWorkflow = this._workflows.get(condition.target)!;
        sum += this.getPossiblePasses(targetWorkflow, passingRange);
      }
      range = failingRange;
    }
    if (workflow.fallback === "A") sum += this._countInRange(range);
    else if (workflow.fallback !== "R") {
      const targetWorkflow = this._workflows.get(fallback!)!;
      sum += this.getPossiblePasses(targetWorkflow, range);
    }
    return sum;
  };

  private _parseCondition = (condition: string): Condition => {
    const [field, operator, value, _, target] = condition.split(/(<|>|:)/);
    return { field: field as Field, operator, value: Number(value), target };
  };

  private _evaluateCondition = (condition: Condition, part: Part): boolean => {
    const { field, operator, value } = condition;
    if (operator === "<") return part[field] < value;
    return part[field] > value;
  };

  _applyConditionToRange = (condition: Condition, range: Range): Range[] => {
    const { field, operator, value } = condition;
    const [min, max] = range[field];
    let passingRange: Range;
    let failingRange: Range;
    if (operator === "<") {
      passingRange = { ...range, [field]: [min, value] };
      failingRange = { ...range, [field]: [value, max] };
    } else {
      passingRange = { ...range, [field]: [value + 1, max] };
      failingRange = { ...range, [field]: [min, value + 1] };
    }
    return [passingRange, failingRange];
  };

  _countInRange = (range: Range): number => {
    return prod(Object.values(range).map(([min, max]) => Math.max(0, max - min)));
  };
}

const parts = partStrings.map(parsePart);
const p = new Process(workflowStrings);
const r: Range = { x: [1, 4001], m: [1, 4001], a: [1, 4001], s: [1, 4001] };
const n = p.getPossiblePasses(p._workflows.get("in")!, r);
console.log(n);
// const c: Condition = { field: "x", operator: ">", value: 4000, target: "R" };
// console.log(getPartsRatings(parts.map(p.processPart)));
