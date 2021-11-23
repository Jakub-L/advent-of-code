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

/**
 * Decodes memory addresses using provided mask
 * @param {string} mask - Masking string, "1" and "0" switch bits to those numbers, "X" leaves unchanged
 * @param {number} source - Source memory address to go through the masking/floating process
 * @returns {number[]} Decimal representation of all addresses after floating bits are considered
 */
const decodeMemoryAddresses = (mask, source) => {
  let addresses = [''];
  const bin = source.toString(2).padStart(36, '0');
  // Mask source address
  for (const i in mask) {
    addresses = addresses.reduce((acc, e) => {
      if (mask[i] === '1') return [...acc, `${e}1`];
      if (mask[i] === '0') return [...acc, `${e}${bin[i]}`];
      if (mask[i] === 'X') return [...acc, `${e}1`, `${e}0`];
    }, []);
  }
  return addresses.map((addr) => parseInt(addr, 2));
};

/**
 * Finds the sum of the memory at the end of all instructions
 * @param {string[]} instructions - List of memory and masking instructions
 * @param {boolean=false} decoder - Whether the program should work as a memory address decoder
 * @returns {number} Sum of all existing memory addresses
 */
const sumMemory = (instructions, decoder = false) => {
  const rules = {
    mask: (acc, mask) => ({ ...acc, mask }),
    mem: (acc, addr, val) => {
      if (decoder) {
        decodeMemoryAddresses(acc.mask, Number(addr)).forEach((address) => {
          acc.sum += Number(val) - (acc.mem[address] || 0);
          acc.mem[address] = Number(val);
        });
      } else {
        const newVal = maskValue(acc.mask, Number(val));
        acc.sum += newVal - (acc.mem[addr] || 0);
        acc.mem[addr] = newVal;
      }
      return acc;
    }
  };
  const finalState = instructions.reduce(
    (acc, instr) => {
      const [cmd, ...args] = instr.split(/\[|\]? = /);
      return rules[cmd](acc, ...args);
    },
    {
      mem: [],
      mask: '',
      sum: 0
    }
  );
  return finalState.sum;
};

module.exports = { sumMemory };
