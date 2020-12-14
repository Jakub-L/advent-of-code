/* eslint-disable guard-for-in */
/**
 * Masks a 36-bit unsigned number
 * @param {string} mask - Masking string, "1" and "0" switch bits to those numbers, "X" leaves unchanged
 * @param {number} value - Number to mask
 * @returns {number} New masked value
 */
const maskValue = (mask, value) => {
  const bin = value.toString(2).padStart(36, '0');
  let masked = '';
  for (const i in mask) masked += mask[i] === 'X' ? bin[i] : mask[i];
  return parseInt(masked, 2);
};

const sumMemory = (instructions) => {
  const rules = {
    mask: (acc, mask) => ({ ...acc, mask }),
    mem: (acc, addr, val) => {
      acc.mem[addr] = maskValue(acc.mask, Number(val));
      return acc;
    },
  };
  const finalState = instructions.reduce(
    (acc, instr) => {
      const [cmd, ...args] = instr.split(/\[|\]? = /);
      return rules[cmd](acc, ...args);
    },
    {
      mem: [],
      mask: '',
    }
  );
  return finalState.mem.reduce((sum, val) => sum + val, 0);
};

module.exports = { sumMemory };
