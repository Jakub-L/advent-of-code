import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { gcd, sum } from "@jakub-l/aoc-lib/math";

/**
 * Represents a single puzzle diagram
 */
type Diagram = {
  /** Target light pattern where '#' means on and '.' means off */
  lights: string;
  /** Array of buttons, each containing indices of lights/counters it affects */
  buttons: number[][];
  /** Counter values */
  joltage: number[];
};

const input: Diagram[] = readFile(__dirname + "/input.txt", ["\n"], parseDiagram);

/**
 * Parses a single line of input into a Diagram structure.
 *
 * Expected format: [.#.#] (0,1) (2,3) {5,10,15,20}
 * - Square brackets contain the target light pattern
 * - Parentheses contain button definitions (comma-separated indices)
 * - Curly braces contain joltage values (comma-separated)
 *
 * @param str - A single line from the input file
 * @returns Parsed diagram with lights, buttons, and joltage
 */
function parseDiagram(str: string): Diagram {
  const [_, lights, buttonsStr, joltageStr] = /\[([.#]+)\] (.*) \{([\d,]+)\}/.exec(str)!;

  const buttons = buttonsStr
    .match(/\(([^)]+)\)/g)!
    .map(s => s.slice(1, -1).split(",").map(Number));
  const joltage = joltageStr.split(",").map(Number);

  return { lights, buttons, joltage };
}

/**
 * Finds the minimum number of button presses to achieve the target light pattern.
 *
 * Uses brute-force enumeration over all 2^n button combinations, where n is
 * the number of buttons. For each combination, simulates the light toggles
 * and checks if the final state matches the target.
 *
 * Each button toggles specific lights. A light is on ('#') if toggled an odd
 * number of times, off ('.') if toggled an even number of times.
 *
 * @param diagram - The puzzle diagram to solve
 * @returns Minimum button presses needed, or Infinity if impossible
 */
const findMinimumPresses = (diagram: Diagram): number => {
  const buttonCount = diagram.buttons.length;
  let minimumPresses = Infinity;

  for (let i = 0; i < 2 ** buttonCount; i++) {
    const binaryMask = i.toString(2).padStart(buttonCount, "0").split("").map(Number);

    const lightToggles = binaryMask.reduce((acc, press, idx) => {
      if (press === 0) return acc;
      for (const light of diagram.buttons[idx]) {
        acc[light] = (acc[light] ?? 0) + 1;
      }
      return acc;
    }, Array(diagram.lights.length).fill(0));

    const lightState = lightToggles
      .map(toggleCount => (toggleCount % 2 === 1 ? "#" : "."))
      .join("");

    if (diagram.lights === lightState) {
      minimumPresses = Math.min(minimumPresses, sum(binaryMask));
    }
  }

  return minimumPresses;
};

/**
 * Represents a system of linear equations.
 *
 * This class solves an integer linear programming problem: given a set of buttons
 * that each affect certain counters, find the minimum total button presses needed
 * to reduce all counters to zero.
 *
 * The approach uses Gauss-Jordan elimination over integers to transform the system
 * into reduced row echelon form. This reveals which variables are pivot variables
 * (determined by other variables) and which are free parameters. We then enumerate
 * all valid combinations of free parameters within their bounds and find the one
 * that minimizes total presses.
 *
 * Integer arithmetic is preserved throughout by using GCD-based row reduction
 * instead of division, ensuring exact solutions for Diophantine equations.
 */
class EquationSystem {
  /**
   * The coefficient matrix where each row represents an equation and each
   * column represents a button. A value of 1 at [i][j] means button j
   * affects counter i.
   */
  private coefficients: number[][];

  /**
   * The right-hand side of each equation, representing the target value
   * each counter must reach (initially the joltage values).
   */
  private counters: number[];

  /**
   * Upper bounds for each button's press count. A button affecting counters
   * with values [a, b, c] can be pressed at most min(a, b, c) times, since
   * pressing more would make some counter negative.
   */
  private bounds: number[];

  /**
   * Constructs the equation system from a diagram.
   *
   * Each button becomes a column in the coefficient matrix. The value at
   * position [i][j] is 1 if button j affects counter i, 0 otherwise.
   * Button bounds are computed as the minimum joltage among affected counters.
   *
   * @param diagram - The puzzle input containing buttons and their effects
   */
  constructor(diagram: Diagram) {
    const numCounters = diagram.joltage.length;
    this.counters = diagram.joltage;
    this.coefficients = Array.from({ length: numCounters }, () => []);
    this.bounds = [];

    for (const button of diagram.buttons) {
      const buttonSet = new Set(button);
      this.bounds.push(Math.min(...button.map(n => this.counters[n])));
      for (let i = 0; i < numCounters; i++) {
        this.coefficients[i].push(buttonSet.has(i) ? 1 : 0);
      }
    }
  }

  /**
   * Transforms the system to reduced row echelon form using Gauss-Jordan elimination.
   *
   * The algorithm proceeds in two phases:
   * 1. Forward elimination: For each pivot position, find a non-zero element
   *    (swapping columns if needed to find one), move it to the pivot position,
   *    then eliminate all elements below it.
   * 2. Back substitution: Eliminate elements above each pivot, working from
   *    bottom to top.
   *
   * Column swapping is used instead of just row swapping because we need to
   * handle underdetermined systems where some columns may be linearly dependent.
   * When columns are swapped, the corresponding bounds are also swapped to
   * maintain the association between columns and button constraints.
   *
   * Zero rows are removed after forward elimination to simplify back substitution.
   */
  reduce(): void {
    this.forwardElimination();
    this.removeZeroRows();
    this.backSubstitution();
  }

  /**
   * Performs forward elimination to create an upper triangular matrix.
   *
   * For each pivot position, searches rightward for a column with a non-zero
   * element in the pivot row or below. If found, swaps columns to bring it
   * to the pivot position, then eliminates all elements below the pivot.
   */
  private forwardElimination(): void {
    const numCols = this.coefficients[0].length;
    const numRows = this.coefficients.length;

    for (let pivotIdx = 0; pivotIdx < numCols; pivotIdx++) {
      const pivotRow = this.findAndPositionPivot(pivotIdx, numCols, numRows);
      if (pivotRow === -1) break;

      for (let targetRow = pivotIdx + 1; targetRow < numRows; targetRow++) {
        this.eliminateElement(pivotIdx, targetRow);
      }
    }
  }

  /**
   * Finds a non-zero pivot element and positions it at the diagonal.
   *
   * Searches columns from pivotIdx rightward for one containing a non-zero
   * element at or below row pivotIdx. Swaps columns and rows as needed
   * to position the pivot on the diagonal.
   *
   * @param pivotIdx - The current pivot position (row and target column)
   * @param numCols - Total number of columns
   * @param numRows - Total number of rows
   * @returns The row index of the pivot, or -1 if no pivot found
   */
  private findAndPositionPivot(pivotIdx: number, numCols: number, numRows: number): number {
    for (let searchCol = pivotIdx; searchCol < numCols; searchCol++) {
      for (let row = pivotIdx; row < numRows; row++) {
        if (this.coefficients[row][searchCol] !== 0) {
          this.swapCols(pivotIdx, searchCol);
          this.swapRows(pivotIdx, row);
          return row;
        }
      }
    }
    return -1;
  }

  /**
   * Removes rows that are entirely zero from the system.
   *
   * After forward elimination, zero rows represent redundant equations
   * and can be safely removed. This reduces the system size and reveals
   * the true rank, which determines how many free parameters exist.
   */
  private removeZeroRows(): void {
    const validIndices: number[] = [];
    for (let row = 0; row < this.coefficients.length; row++) {
      if (this.coefficients[row].some(val => val !== 0)) {
        validIndices.push(row);
      }
    }
    this.coefficients = validIndices.map(i => this.coefficients[i]);
    this.counters = validIndices.map(i => this.counters[i]);
  }

  /**
   * Performs back substitution to achieve reduced row echelon form.
   *
   * Working from the bottom row upward, eliminates all elements above
   * each pivot. Combined with forward elimination, this produces a
   * matrix where each pivot column has exactly one non-zero element.
   */
  private backSubstitution(): void {
    for (let pivotRow = this.coefficients.length - 1; pivotRow >= 0; pivotRow--) {
      for (let targetRow = 0; targetRow < pivotRow; targetRow++) {
        this.eliminateElement(pivotRow, targetRow);
      }
    }
  }

  /**
   * Swaps two rows in both the coefficient matrix and counter vector.
   *
   * @param i - First row index
   * @param j - Second row index
   */
  private swapRows(i: number, j: number): void {
    if (i === j) return;
    [this.coefficients[i], this.coefficients[j]] = [this.coefficients[j], this.coefficients[i]];
    [this.counters[i], this.counters[j]] = [this.counters[j], this.counters[i]];
  }

  /**
   * Swaps two columns in both the coefficient matrix and bounds array.
   *
   * Column swapping reorders which button corresponds to which column.
   * The bounds array must be swapped in parallel to maintain the correct
   * upper bound for each column.
   *
   * @param i - First column index
   * @param j - Second column index
   */
  private swapCols(i: number, j: number): void {
    if (i === j) return;
    for (const row of this.coefficients) {
      [row[i], row[j]] = [row[j], row[i]];
    }
    [this.bounds[i], this.bounds[j]] = [this.bounds[j], this.bounds[i]];
  }

  /**
   * Eliminates the element at the pivot column in the target row.
   *
   * Uses integer-preserving row operations: instead of dividing to get
   * a multiplier, we scale both rows and divide by their GCD. This
   * ensures all values remain integers, which is essential for finding
   * exact Diophantine solutions.
   *
   * The operation is: targetRow = (scale1 * pivotRow + scale2 * targetRow) / gcd
   * where scale1 and scale2 are chosen to zero out the target element.
   *
   * @param pivotRow - The row containing the pivot element
   * @param targetRow - The row to eliminate into
   */
  private eliminateElement(pivotRow: number, targetRow: number): void {
    const pivotValue = this.coefficients[pivotRow][pivotRow];
    if (pivotValue === 0) return;

    const targetValue = this.coefficients[targetRow][pivotRow];
    if (targetValue === 0) return;

    const scale1 = -targetValue;
    const scale2 = pivotValue;
    const divisor = gcd(scale1, scale2);

    this.coefficients[targetRow] = this.coefficients[targetRow].map(
      (val, col) => (scale1 * this.coefficients[pivotRow][col] + scale2 * val) / divisor
    );
    this.counters[targetRow] =
      (scale1 * this.counters[pivotRow] + scale2 * this.counters[targetRow]) / divisor;
  }

  /**
   * Finds the minimum sum of button presses that solves the system.
   *
   * After reduction to RREF, the system has (numCols - numRows) free parameters.
   * These correspond to buttons whose values can be chosen freely (within bounds).
   * For each combination of free parameter values, the pivot variables are
   * uniquely determined by back-substitution.
   *
   * We enumerate all valid free parameter combinations and compute the total
   * press count for each. A combination is valid only if all pivot variables
   * are non-negative integers.
   *
   * The search space is bounded by the minimum joltage values, ensuring
   * polynomial time complexity for reasonable inputs.
   *
   * @returns The minimum total button presses, or Infinity if no solution exists
   */
  solveMinimizingSum(): number {
    const numCols = this.coefficients[0].length;
    const numRows = this.coefficients.length;
    const freeBounds = this.bounds.slice(numRows);

    let minSum = Infinity;

    for (const freeParams of this.enumerateParameterCombinations(freeBounds)) {
      const result = this.evaluateSolution(freeParams, numRows, numCols);
      if (result < minSum) minSum = result;
    }

    return minSum;
  }

  /**
   * Generates all combinations of free parameter values within their bounds.
   *
   * Uses an iterative approach with a counter array, incrementing like an
   * odometer. This avoids the memory overhead of building all combinations
   * upfront and allows early termination if needed.
   *
   * @param bounds - Upper bounds for each free parameter (inclusive)
   * @yields Arrays of parameter values, one for each combination
   */
  private *enumerateParameterCombinations(bounds: number[]): Generator<number[]> {
    if (bounds.length === 0) {
      yield [];
      return;
    }

    const current = new Array(bounds.length).fill(0);

    while (true) {
      yield [...current];

      let idx = bounds.length - 1;
      while (idx >= 0 && current[idx] >= bounds[idx]) {
        current[idx] = 0;
        idx--;
      }
      if (idx < 0) break;
      current[idx]++;
    }
  }

  /**
   * Evaluates the total button presses for a given set of free parameters.
   *
   * With free parameters fixed, each pivot variable is determined by:
   *   pivot[i] = (counter[i] - sum(coef[i][j] * free[j])) / diagonal[i]
   *
   * The solution is valid only if all pivot values are non-negative integers.
   *
   * @param freeParams - Values for the free parameters
   * @param numRows - Number of pivot variables (rows in reduced matrix)
   * @param numCols - Total number of variables (columns)
   * @returns Total button presses, or Infinity if solution is invalid
   */
  private evaluateSolution(freeParams: number[], numRows: number, numCols: number): number {
    let total = sum(freeParams);
    const freeStartCol = numCols - freeParams.length;

    for (let row = 0; row < numRows; row++) {
      let freeContribution = 0;
      for (let i = 0; i < freeParams.length; i++) {
        freeContribution += freeParams[i] * this.coefficients[row][freeStartCol + i];
      }

      const remainder = this.counters[row] - freeContribution;
      const diagonalValue = this.coefficients[row][row];

      if (remainder % diagonalValue !== 0) return Infinity;

      const pivotValue = remainder / diagonalValue;
      if (pivotValue < 0) return Infinity;

      total += pivotValue;
    }

    return total;
  }
}

/**
 * Solves the button press minimization problem for a single diagram.
 *
 * Constructs the equation system, reduces it to RREF, and finds the
 * minimum sum solution.
 *
 * @param diagram - The puzzle input
 * @returns Minimum total button presses needed
 */
const solveEquationSystem = (diagram: Diagram): number => {
  const system = new EquationSystem(diagram);
  system.reduce();
  return system.solveMinimizingSum();
};

// Results
console.log(`Part 1: ${sum(input.map(findMinimumPresses))}`);
console.log(`Part 2: ${sum(input.map(solveEquationSystem))}`);