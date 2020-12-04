const rules = {
  byr: (val) => val >= 1920 && val <= 2002,
  iyr: (val) => val >= 2010 && val <= 2020,
  eyr: (val) => val >= 2020 && val <= 2030,
  hgt: (val) => {
    const [num, unit] = val.match(/\d{2,3}|\w{2}/g);
    return (
      (unit === 'cm' && num >= 150 && num <= 193) ||
      (unit === 'in' && num >= 59 && num <= 76)
    );
  },
  hcl: (val) => /^#[0-9a-f]{6}$/.test(val),
  ecl: (val) => /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(val),
  pid: (val) => /^[0-9]{9}$/.test(val)
};

/**
 * Counts the number of valid passports within an array of passports
 * @param {string[]} array - Array of passports
 * @returns {number} Count of elements in _array_ that are passports
 */
const countPassports = (array) =>
  array.filter((passport) =>
    Object.keys(rules).every((key) => passport.includes(key))
  ).length;

/**
 * Counts the number of passports within the array that fulfil rules
 * @param {string[]} array - Array of passports
 * @returns {number} Count of valid passports
 */
const countValidPassports = (array) => {
  return array.filter(
    (passport) =>
      Object.keys(rules).every((key) => passport.includes(key)) &&
      passport.split(' ').every((pair) => {
        const [key, val] = pair.split(':');
        return rules[key] ? rules[key](val) : true;
      })
  ).length;
};

module.exports = { countPassports, countValidPassports };
