/**
 * Returns the state of the accumulator after a set of instructions
 * @param {string[]} instructions - Array of CPU instructions
 * @param {number=0} mem - Starting value of the memory (accumulator)
 * @param {number=1} maxLoop - Maximum number of times each instruction is allowed to run
 * @returns {Object} State of accumulator and whether the function terminated (ran to completion)
 */
const cpu = (instructions, mem = 0, maxLoop = 1) => {
  const commands = {
    acc: (mem, i, incr) => [mem + Number(incr), i + 1],
    jmp: (mem, i, incr) => [mem, i + Number(incr)],
    nop: (mem, i) => [mem, i + 1]
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
 * Finds wrongly placed nop/jmp command, swaps them, and returns accumulator after termination
 * @param {string[]} instructions - Array of CPU instructions
 * @returns {number} State of accumulator after successful fix and termination
 */
const fixIncorrectInstruction = (instructions) => {
  const swap = { nop: 'jmp', jmp: 'nop' };

  for (let i in instructions) {
    const [cmd, incr] = instructions[i].split(' ');
    if (swap[cmd]) {
      const swappedInstructions = instructions.map((instr, j) =>
        j == i ? `${swap[cmd]} ${incr}` : instr
      );
      const { accumulator, terminated } = cpu(swappedInstructions);
      if (terminated) {
        return accumulator;
      }
    }
  }

  return -1;
};

module.exports = { cpu, fixIncorrectInstruction };
