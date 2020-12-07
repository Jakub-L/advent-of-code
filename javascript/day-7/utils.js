/**
 * Interprets description of bags to a child-parent object
 * @param {string[]} bags - List of sentences describing bags and their contents
 * @returns {object} Object of bag types and their parents, including quantity of bag per parent
 */
const generateParentsObject = (bags) =>
  bags.reduce((dict, row) => {
    const [parent, ...children] = row.split(
      /(?: bag[s., ]+)(?:contain +)*(\d+)*(?: )*/
    );
    for (let i = 0; i < children.length; i += 2) {
      const [count, child] = [Number(children[i]), children[i + 1]];
      if (!count) {
        break;
      }
      dict[child] = dict[child]
        ? { ...dict[child], [parent]: count }
        : { [parent]: count };
    }
    return dict;
  }, {});

/**
 * Interprets description of bags to a parent-child object
 * @param {string[]} bags - List of sentences describing bags and their contents
 * @returns {object} Object of bag types and their children
 */
const generateChildrenObject = (bags) =>
  bags.reduce((dict, row) => {
    const [parent, ...children] = row.split(
      /(?: bag[s., ]+)(?:contain +)*(\d+)*(?: )*/
    );
    for (let i = 0; i < children.length; i += 2) {
      const [count, child] = [Number(children[i]), children[i + 1]];
      if (!dict[parent]) {
        dict[parent] = {};
      }
      dict[parent] = count
        ? { ...dict[parent], [child]: count }
        : { ...dict[parent] };
    }
    return dict;
  }, {});

/**
 * Finds the number of bags which eventually contain specified bag
 * @param {string} bag - Colour of the bag to bring on board
 * @param {string[]} allBags - List of sentences describing bags and their contents
 * @returns {number} Number that eventually contains the specified bag
 */
const countContainingBags = (bag, allBags) => {
  const parents = generateParentsObject(allBags);
  const getParents = (bagName) => {
    let result = parents[bagName];
    for (key in result) {
      result = { ...result, ...getParents(key) };
    }
    return result;
  };
  return Object.keys(getParents(bag)).length;
};

/**
 * Finds the number of contained within a target bag
 * @param {string} bag - Colour of the bag to bring on board
 * @param {string[]} allBags - List of sentences describing bags and their contents
 * @returns {number} Number of bags within the on-board bag
 */
const countContainedBags = (bag, allBags) => {
  const children = generateChildrenObject(allBags);
  const countChildren = (bagName, count) => {
    let result = children[bagName];
    for (key in result) {
      count += result[key] * countChildren(key, 1);
    }
    return count;
  };
  return countChildren('shiny gold', 0);
};

module.exports = { countContainingBags, countContainedBags };
