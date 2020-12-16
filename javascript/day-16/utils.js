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

//
// PART 2
//
/**
 * For each column in tickets finds the fields that have their requirements satisfied.
 * @param {Object} ticketDocument - Object containing ticket fields, user's ticket and nearby tickets
 * @return {Object[]} Array of objects with key/values: col (column in ticket) and fields
 *                    (possible field names for which the column passes limit testing)
 *                    sorted from fewest possible fields to most
 */
const findPossibleMatches = (ticketDocument) => {
  const fields = parseFields(ticketDocument.fields);
  const tickets = parseNearbyTickets(ticketDocument.nearbyTickets).filter(
    (ticket) => findInvalidNumber(ticket, fields) === undefined
  );
  const possibleMatches = [];
  for (let col = 0; col < tickets[0].length; col += 1) {
    possibleMatches.push({
      col,
      fields: fields.reduce(
        (acc, { name, limits }) =>
          tickets.every((t) => isInLimits(t[col], limits))
            ? [...acc, name]
            : acc,
        []
      )
    });
  }
  return possibleMatches.sort((a, b) => a.fields.length - b.fields.length);
};

/**
 * Finds the actual field names for each column of the ticket
 * @param {Object} ticketDocument - Object containing ticket fields, user's ticket and nearby tickets
 * @returns {Object[]} Array of objects containing a col key (indicating the column in the ticket), and a
 *                     field key (indicating the name of the field that has been matched)
 */
const decodeFields = (ticketDocument) =>
  findPossibleMatches(ticketDocument).reduce((acc, { col, fields }) => {
    return [
      ...acc,
      {
        col,
        // Find first field that hasn't been assigned yet
        field: fields.find((option) =>
          acc.every(({ field }) => option !== field)
        )
      }
    ];
  }, []);

/**
 * Multiplies the values of all the fields beginning with "Departure" on myTicket
 * @param {Object} ticketDocument - Object containing ticket fields, user's ticket and nearby tickets
 * @returns {number} Product of values of all fields beginning with "departure"
 */
const multiplyDepartureFields = (ticketDocument) => {
  const myTicket = parseTicket(ticketDocument.myTicket);
  const decoded = decodeFields(ticketDocument);

  return decoded.reduce(
    (acc, { col, field }) =>
      field.startsWith('departure') ? acc * myTicket[col] : acc,
    1
  );
};

module.exports = { findTicketErrorRate, multiplyDepartureFields };
