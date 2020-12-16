//
// INPUT PARSING
//
/**
 * Converts ticket field definitions to parseable array
 * @param {string[]} fieldStrings - Definitions of fields and their permitted ranges
 * @returns {Object[]} Array of objects containing field name and field limits
 */
const parseFields = (fieldStrings) =>
  fieldStrings.reduce((acc, string) => {
    const [name, ...limits] = string.split(/: |-| or /);
    return [...acc, { name, limits: limits.map(Number) }];
  }, []);

/**
 * Converts a single ticket to an array
 * @param {string} ticketString - Individual ticket in single-line string form
 * @returns {number[]} Ticket in array form
 */
const parseTicket = (ticketString) => ticketString.split(',').map(Number);

/**
 * Converts nearby tickets string array to numeric fomr
 * @param {string[]} nearbyTickets - Array of individual tickets in single-line string form
 * @returns {number[][]} Tickets as arrays of numbers
 */
const parseNearbyTickets = (nearbyTickets) => nearbyTickets.map(parseTicket);

//
// PART 1
//
/**
 * Checks if a number falls within limits (inclusive)
 * @param {number} number - Number to check
 * @param {number[]} limits - Array of field limit pairs (lower, then upper, then next lower, etc.)
 * @return {boolean} True if number falls within any pair of limits, false otherwise
 */
const isInLimits = (number, limits) => {
  for (let i = 0; i < limits.length; i += 2) {
    if (number >= limits[i] && number <= limits[i + 1]) return true;
  }
  return false;
};
/**
 * Finds the first number in a ticket that doesn't fit any field's limits
 * @param {number[]} ticket - Ticket in array form
 * @param {Object[]} fields - Array of objects containing field name and field limits
 * @returns {number|undefined} Invalid number, or undefined if all numbers are valid
 */
const findInvalidNumber = (ticket, fields) =>
  ticket.find((num) => fields.every(({ limits }) => !isInLimits(num, limits)));

/**
 * Calculates the ticket scanning error rate
 * @param {Object} ticketDocument - Object containing ticket fields, user's ticket and nearby tickets
 * @returns {number} Sum of all invalid numbers
 */
const findTicketErrorRate = (ticketDocument) => {
  const fields = parseFields(ticketDocument.fields);
  const tickets = parseNearbyTickets(ticketDocument.nearbyTickets);

  return tickets.reduce(
    (sum, ticket) => sum + (findInvalidNumber(ticket, fields) || 0),
    0
  );
};

module.exports = { findTicketErrorRate };
