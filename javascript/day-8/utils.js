const { cpu } = require('../global-utils');

/**
 * Finds wrongly placed nop/jmp command, swaps them, and returns accumulator after termination
 * @param {string[]} instructions - Array of CPU instructions
 * @returns {number} State of accumulator after successful fix and termination
 */
const fixIncorrectInstruction = (instructions) => {
  const swap = { nop: 'jmp', jmp: 'nop' };

  for (let i = 0; i < instructions.length; i += 1) {
    const [cmd, incr] = instructions[i].split(' ');
    if (swap[cmd]) {
      const swappedInstructions = instructions.map((instr, j) =>
        j === i ? `${swap[cmd]} ${incr}` : instr
      );
      const { accumulator, terminated } = cpu(swappedInstructions);
      if (terminated) {
        return accumulator;
      }
    }
  }

  return -1;
};

module.exports = { fixIncorrectInstruction };
