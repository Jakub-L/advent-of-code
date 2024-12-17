// Input
const program: bigint[] = [2, 4, 1, 1, 7, 5, 1, 5, 4, 1, 5, 5, 0, 3, 3, 0].map(BigInt);
const startA: bigint = 17323786n;

// Part 1
/**
 * Returns the result of a single step of the program.
 *
 * By looking at our input, we can decompile the program into the following instructions:
 *      2, 4: bst(4) -> B = A % 8
 *      1, 1: bxl(1) -> B = B ^ 1
 *      7, 5: cdv(5) -> C = A // (2 ** B)
 *      1, 5: bxl(5) -> B = B ^ 5
 *      4, 1: bxc(1) -> B = B ^ C
 *      5, 5: out(5) -> output(B % 8)
 *      0, 3: adv(3) -> A = A // (2 ** 3)
 *      3, 0: jnz(0) -> if (A != 0) goto 0
 *
 * The program will perform some operations on the A, B and C registers, then truncate the
 * result to 3 bits and output it. The program will then divide A by 8 and repeat until A = 0.
 * Since B is only using the last 3 bits of A, we can ignore the rest of the bits.
 *
 * This means that we can simulate most of the program into one step. Note that we are using
 * bigint to deal with the fact that JS XOR operator works on 32-bit integers. It also saves us
 * a few characters by automatically truncating division.
 *
 * @param {bigint} A - The value of the A register.
 * @returns {bigint} - The value to be pushed to the output.
 */
const step = (A: bigint): bigint => {
  let B, C;
  B = A % 8n;
  B = B ^ 1n;
  C = A / 2n ** B;
  B = B ^ 5n;
  B = B ^ C;
  return B % 8n;
};

/**
 * Runs the program and returns the output.
 * @param {bigint} A - The initial value of the A register.
 * @returns {bigint[]} - The output of the program.
 */
const run = (A: bigint): bigint[] => {
  const output: bigint[] = [];
  while (A !== 0n) {
    output.push(step(A));
    A = A / 8n;
  }
  return output;
};

// Part 2
/**
 * Finds the smallest starting value of the A register such that the output
 * is equal to the program itself (a quine).
 *
 * Essentially recursively builds a possible A value in base 8. For example,
 * we know that the final digit of the program is a 0 and that only the 3 last
 * bits of A are used for the output. Therefore we can run through all possible
 * values for those 3 bits (0 to 7). If any of those values output a 0, they could
 * be a candidate for the correct A value.
 *
 * We then shift it to the next octal digit (multiply by 8) and repeat the process.
 * If at any point the output does not match the program, we discard that candidate.
 * Eventually, we will reach the first digit of the program and have built a possible
 * A value that produces the program as output.
 *
 * There may be multiple A values that produce the same output, but we are looking for
 * the smallest one.
 *
 * @returns {number} - The smallest value of A that will produce a quine.
 */
const findQuine = (): number => {
  const output: bigint[] = [];
  const findCandidate = (A: bigint, index: number) => {
    if (step(A) !== program[index]) return;
    if (index === 0) output.push(A);
    else {
      for (let B = 0n; B < 8n; B++) findCandidate(A * 8n + B, index - 1);
    }
  };

  for (let A = 0n; A < 8n; A++) findCandidate(A, program.length - 1);
  return Math.min(...output.map(Number));
};

// Results
console.log(`Part 1: ${run(startA).join(",")}`);
console.log(`Part 2: ${findQuine()}`);
