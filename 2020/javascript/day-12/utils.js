/**
 * Converts an angle
 * @param {number} deg - Angle in degrees
 * @returns {number} Input angle in radians
 */
const rad = (deg) => (deg * Math.PI) / 180;

/**
 * Finds the Manhattan distance of a moving ship
 * @param {string[]} movements - List of movements of the ship
 * @returns {number} Manhattan distance from the starting position
 */
const findManhattanDistance = (movements) => {
  rules = {
    N: (n, { x, y, a }) => ({ x, y: y + n, a }),
    S: (n, { x, y, a }) => ({ x, y: y - n, a }),
    E: (n, { x, y, a }) => ({ x: x + n, y, a }),
    W: (n, { x, y, a }) => ({ x: x - n, y, a }),
    L: (n, { x, y, a }) => ({ x, y, a: a + n }),
    R: (n, { x, y, a }) => ({ x, y, a: a - n }),
    F: (n, { x, y, a }) => ({
      x: x + Math.round(n * Math.cos(rad(a))),
      y: y + Math.round(n * Math.sin(rad(a))),
      a
    })
  };
  const position = movements.reduce(
    (acc, mov) => {
      const [_, cmd, n] = mov.match(/([NSEWLRF])(\d+)/);
      return rules[cmd](Number(n), acc);
    },
    { x: 0, y: 0, a: 0 }
  );
  return Math.abs(position.x) + Math.abs(position.y);
};

const rotateWaypoint = ({ x, y }, a) => ({
  x: Math.round(x * Math.cos(rad(a)) - y * Math.sin(rad(a))),
  y: Math.round(x * Math.sin(rad(a)) + y * Math.cos(rad(a)))
});

/**
 * Finds the Manhattan distance of a ship moving with reference to a waypoint
 * @param {string[]} movements - List of movements of the ship
 * @returns {number} Manhattan distance from the starting position
 */
const findManhattanWaypointDistance = (movements) => {
  const rules = {
    N: (n, ship, wp) => ({ ship, wp: { ...wp, y: wp.y + n } }),
    S: (n, ship, wp) => ({ ship, wp: { ...wp, y: wp.y - n } }),
    E: (n, ship, wp) => ({ ship, wp: { ...wp, x: wp.x + n } }),
    W: (n, ship, wp) => ({ ship, wp: { ...wp, x: wp.x - n } }),
    L: (n, ship, wp) => ({ ship, wp: rotateWaypoint(wp, n) }),
    R: (n, ship, wp) => ({ ship, wp: rotateWaypoint(wp, -n) }),
    F: (n, ship, wp) => ({
      ship: { x: ship.x + n * wp.x, y: ship.y + n * wp.y },
      wp
    })
  };
  const position = movements.reduce(
    ({ ship, wp }, mov) => {
      const [_, cmd, n] = mov.match(/([NSEWLRF])(\d+)/);
      return rules[cmd](Number(n), ship, wp);
    },
    { ship: { x: 0, y: 0 }, wp: { x: 10, y: 1 } }
  );
  return Math.abs(position.ship.x) + Math.abs(position.ship.y);
};

module.exports = { findManhattanDistance, findManhattanWaypointDistance };
