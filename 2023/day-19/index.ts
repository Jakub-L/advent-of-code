import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { prod, sum } from "@jakub-l/aoc-lib/math";

// UTILS
type Field = "x" | "m" | "a" | "s";
type Part = { x: number; m: number; a: number; s: number; status: "A" | "R" | null };
type Range = { x: [number, number]; m: [number, number]; a: [number, number]; s: [number, number] };
type Condition = { field: Field; operator: string; value: number; target: string };
type Workflow = { name: string; conditions?: Condition[]; fallback?: string };

/**
 * Converts a part string to a Part object
 * @param {string} part - Part string to process
 * @returns {Part} The part as a Part object
 */
const parsePart = (part: string): Part => {
  const [x, m, a, s] = part.match(/\d+/g)!.map(Number);
  return { x, m, a, s, status: null };
};

/**
 * Converts a condition string to a Condition object
 * @param {string} condition - Condition string to process
 * @returns {Condition} The condition as a Condition object
 */
const parseCondition = (condition: string): Condition => {
  const [field, operator, value, _, target] = condition.split(/(<|>|:)/);
  return { field: field as Field, operator, value: Number(value), target };
};

/**
 * Evaluates whether a condition is passed by a part
 * @param {Condition} condition - Condition to evaluate
 * @param {Part} part - Part to evaluate
 * @returns {boolean} Whether the condition is true for the part
 */
const evaluateCondition = (condition: Condition, part: Part): boolean => {
  const { field, operator, value } = condition;
  return operator === "<" ? part[field] < value : part[field] > value;
};

/**
 * Applies a condition to a range of values
 * @param {Condition} condition - Condition to apply
 * @param {Range} range - Range of values to apply the condition to
 * @returns {Range[]} The range split into two parts, one that passes the condition and one that fails
 */
const applyConditionToRange = (condition: Condition, range: Range): Range[] => {
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

/**
 * Gets the number of possible values in a range
 * @param {Range} range - Range to process
 * @returns {number} The number of possible values in the range
 */
const countInRange = (range: Range): number => prod(Object.values(range).map(([min, max]) => Math.max(0, max - min)));

/**
 * Gets the sum of ratings for parts that have been accepted
 * @param {Part[]} parts - Parts to process
 * @returns {number} The sum of accepted parts' ratings
 */
const getPartsRatings = (parts: Part[]): number => {
  return sum(parts.filter(p => p.status === "A").map(p => p.x + p.m + p.a + p.s));
};

/** A part approval process */
class Process {
  /** All the workflows, indexed by their name */
  private _workflows: Map<string, Workflow> = new Map();

  /**
   * Creates a new Process
   * @param {string[]} workflowStrings - Strings describing the workflows
   */
  constructor(workflowStrings: string[]) {
    for (const workflowString of workflowStrings) {
      const [name, conditionString] = workflowString.split(/{|}/);
      const conditions = conditionString.split(",");
      const fallback = conditions.pop()!;
      this._workflows.set(name, {
        name,
        conditions: conditions.map(parseCondition),
        fallback
      });
    }
  }

  /**
   * Processes a part and sets its status
   * @param {Part} part - Part to process
   * @returns {Part} The part with its status set to either approved or rejected
   */
  processPart = (part: Part): Part => {
    let workflow = this._workflows.get("in")!;
    while (part.status === null) {
      let target = workflow.fallback!;
      for (const condition of workflow.conditions!) {
        if (evaluateCondition(condition, part)) {
          target = condition.target!;
          break;
        }
      }
      if (target === "A" || target === "R") return { ...part, status: target };
      else workflow = this._workflows.get(target)!;
    }
    return part;
  };

  /**
   * Finds all the count of possible parts that could pass a workflow. If the starting
   * workflow calls another workflow, the count of possible parts that could pass that
   * second workflow is included in the primary count.
   * @param {Workflow} workflow - Starting workflow, defaults to "in"
   * @param {Range} range - Range of values to consider, defaults to [1, 4001) for all fields
   * @returns {number} The number of possible parts that could pass the workflow
   */
  getPossiblePasses = (
    workflow: Workflow = this._workflows.get("in")!,
    range: Range = { x: [1, 4001], m: [1, 4001], a: [1, 4001], s: [1, 4001] }
  ): number => {
    const { conditions = [], fallback = "R" } = workflow;
    let sum = 0;
    for (const condition of conditions) {
      const [passingRange, failingRange] = applyConditionToRange(condition, range);
      if (condition.target === "A") sum += countInRange(passingRange);
      else if (condition.target !== "R") {
        const targetWorkflow = this._workflows.get(condition.target)!;
        sum += this.getPossiblePasses(targetWorkflow, passingRange);
      }
      range = failingRange;
    }
    if (workflow.fallback === "A") sum += countInRange(range);
    else if (workflow.fallback !== "R") {
      const targetWorkflow = this._workflows.get(fallback!)!;
      sum += this.getPossiblePasses(targetWorkflow, range);
    }
    return sum;
  };
}

// INPUT PROCESSING
const [workflowStrings, partStrings] = readFile(__dirname + "/input.txt", ["\n\n", "\n"]) as string[][];
const process = new Process(workflowStrings);
const parts = partStrings.map(parsePart).map(process.processPart);

// RESULTS
console.log(`Part 1: ${getPartsRatings(parts)}`);
console.log(`Part 2: ${process.getPossiblePasses()}`);
