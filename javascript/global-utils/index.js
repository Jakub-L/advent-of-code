/**
 * Returns the state of the accumulator after a set of instructions
 * @param {string[]} instructions - Array of CPU instructions
 * @param {number=0} mem - Starting value of the memory (accumulator)
 * @param {number=1} maxLoop - Maximum number of times each instruction is allowed to run
 * @returns {Object} State of accumulator and whether the function terminated (ran to completion)
 */
const cpu = (instructions, mem = 0, maxLoop = 1) => {
  const commands = {
    acc: (acc, i, incr) => [acc + Number(incr), i + 1],
    jmp: (acc, i, incr) => [acc, i + Number(incr)],
    nop: (acc, i) => [acc, i + 1],
  };
  const loops = Array(instructions.length).fill(0);
  let terminated = true;
  for (let i = 0; i < instructions.length; ) {
    const [cmd, incr] = instructions[i].split(' ');
    if (loops[i] === maxLoop) {
      terminated = false;
      break;
    }
    loops[i] += 1;
    [mem, i] = commands[cmd](mem, i, incr);
  }

  return { accumulator: mem, terminated };
};

/**
 * Returns first n numbers from an array that sum to a target number
 * @param {number[]} array - Array of numbers to search
 * @param {number} target - Number to which targets should sum
 * @param {number} n - How many numbers are supposed to make up the target number
 * @param {Object} numbersMemo - Memoized object of already-inspected numbers
 * @returns {number[]} Array of n numbers that make up the target or empty array if target can't be made
 */
const findSum = (array, target, n, numbersMemo) => {
  // { ...undefined } is deeply equal to {}
  const dict = { ...numbersMemo };
  for (const e of array) {
    if (n > 2) {
      const subQuery = findSum(array.slice(1), target - e, n - 1, dict);
      if (subQuery.length === 0) {
        continue;
      } else {
        return [e, ...subQuery];
      }
    }

    if (n === 2) {
      if (dict[target - e]) return [e, target - e];
      dict[e] = e;
    } else if (n === 1 && e === target) {
      return [e];
    }
  }
  return [];
};

module.exports = { cpu, findSum };
