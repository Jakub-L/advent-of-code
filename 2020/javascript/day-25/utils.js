/**
 * Finds loop size used in the generation of the public key
 * @param {number} pubKey - Public key to decrypt
 * @returns {number} Loop size
 */
const findLoop = (pubKey) => {
  let [val, loop] = [1, 0];
  while (val !== pubKey) [val, loop] = [(val * 7) % 20201227, loop + 1];
  return loop;
};

/**
 * Transforms the subject number through the loop number
 * @param {number} subject - Subject number to transform
 * @param {number} loop - Number of iterations of the transformation
 * @returns {number} Transformed subject number
 */
const transform = (subject, loop) => {
  let val = 1;
  for (let i = 0; i < loop; i += 1) val = (val * subject) % 20201227;
  return val;
};

/**
 * Finds the encrypted key based on two public keys
 * @param {number} doorKey - Public key associated with the door
 * @param {number} cardKey - Public key associated with the card
 * @returns {number} Encrypted key established by the public handshake
 */
const findEncryptionKey = (doorKey, cardKey) => {
  const doorLoop = findLoop(doorKey);
  return transform(cardKey, doorLoop);
};

module.exports = { findEncryptionKey };
