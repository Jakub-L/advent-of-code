import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { sum } from "@jakub-l/aoc-lib/math";

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
  private _workflows: Map<string, Workflow> = new Map();

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

  private _parseCondition = (condition: string): Condition => {
    const [field, operator, value, _, target] = condition.split(/(<|>|:)/);
    return { field: field as Field, operator, value: Number(value), target };
  };

  private _evaluateCondition = (condition: Condition, part: Part): boolean => {
    const { field, operator, value } = condition;
    if (operator === "<") return part[field] < value;
    return part[field] > value;
  };
}

const parts = partStrings.map(parsePart);
const p = new Process(workflowStrings);
// console.log(p);
console.log(getPartsRatings(parts.map(p.processPart)));
