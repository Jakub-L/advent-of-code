/**
 * Converts field limit strings to a structured object
 * @param {string[]} fieldStrings - Definitions of fields and their permitted ranges
 * @returns {Object[]} Array of objects containing field name and field limits, [lower1, upper1, lower2, upper2]
 */
const parseFields = (fieldStrings) =>
  fieldStrings.reduce((acc, string) => {
    const [name, l1, u1, l2, u2] = string.split(/: |-| or /);
    return [
      ...acc,
      { name, limits: [Number(l1), Number(u1), Number(l2), Number(u2)] },
    ];
  }, []);

/**
 * Checks if a number falls within limits (inclusive)
 * @param {number} number - Number to check
 * @param {number[]} limits - Array of field limits, [lower1, upper1, lower2, upper2]
 * @return {boolean} True if number falls within either limit, false otherwise
 */
const isInLimits = (number, limits) =>
  (number >= limits[0] && number <= limits[1]) ||
  (number >= limits[2] && number <= limits[3]);

/**
 * Calculates the ticket scanning error rate
 * @param {string[]} fieldStrings - Definitions of fields and their permitted ranges
 * @param {string[]} tickets - Array of comma-separated numbers, representing nearby tickets
 * @returns {number} Sum of all fields that do not fit any field limits
 */
const findTicketErrorRate = (fieldStrings, tickets) => {
  const fields = parseFields(fieldStrings);
  return tickets.reduce(
    (err, ticket) =>
      err +
      (ticket
        .split(',')
        .map(Number)
        .find((num) =>
          fields.every(({ limits }) => !isInLimits(+num, limits))
        ) || 0),
    0
  );
};


module.exports = { findTicketErrorRate };
