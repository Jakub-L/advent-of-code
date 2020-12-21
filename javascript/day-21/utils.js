/**
 * Converts string to arrays of ingredients and allergens
 * @param {string} line - A line defining the ingredients (in foreign) and allergens (in English)
 * @returns {Object} Object with keys ingredients and allergens, each an array of strings
 */
const parseLine = (line) => {
  const [_, ingrs, allrs] = /(.*) \(contains (.*)\)/.exec(line);
  return {
    ingrs: ingrs.split(' '),
    allrs: allrs.split(', ')
  };
};

/**
 * Finds which words could correspond to which allergens
 * @param {Object[]} food - Ingredients and allergens per line in the input file
 * @returns {Object} Map of potential names for each allergen
 */
const getPossibleTranslations = (food) =>
  food.reduce((dict, { allrs, ingrs }) => {
    for (const allr of allrs) {
      if (allr in dict) {
        dict[allr] = dict[allr].filter((word) => ingrs.includes(word));
      } else {
        dict[allr] = [...ingrs];
      }
    }
    return dict;
  }, {});

/**
 * Maps the English and foreign words for allergens
 * @param {Object[]} food - Ingredients and allergens per line in the input file
 * @returns {Object} Mapping of English (keys) to foreign (vals);
 */
const findAllergens = (food) => {
  // Sort by number of possible options
  let foodDict = Object.entries(getPossibleTranslations(food)).sort(
    (a, b) => a[1].length - b[1].length
  );
  const mapped = {};

  while (foodDict.length > 0) {
    const [allr, [word]] = foodDict[0];
    mapped[allr] = word;
    foodDict = foodDict
      .slice(1)                                                         // Remove first entry
      .map(([name, words]) => [name, words.filter((w) => w !== word)])  // Filter out just assigned word
      .sort((a, b) => a[1].length - b[1].length);                       // Sort by least options first
  }
  return mapped;
};

/**
 * Counts how many times any word that isn't an allergen appears in all of the input
 * @param {string[]} foodStrings - Array of input strings of foreign ingredients followed by English allergens
 * @returns {number} Count of appearances of non-allergen ingredients
 */
const countNonAllergens = (foodStrings) => {
  const food = foodStrings.map(parseLine);
  const allergenWords = Object.values(findAllergens(food));
  return food.reduce(
    (count, { ingrs }) =>
      count + ingrs.filter((i) => !allergenWords.includes(i)).length,
    0
  );
};

/**
 * Finds the canonical form of the allergen list
 * @param {string[]} foodStrings - Array of input strings of foreign ingredients followed by English allergens
 * @returns {string} Comma separated translations of allergens (sorted by allergen in English)
 */
const findCanonicalList = (foodStrings) => {
  const food = foodStrings.map(parseLine);
  const allergenDict = findAllergens(food);
  return Object.entries(allergenDict)
    .sort(([allergenA], [allergenB]) => (allergenA < allergenB ? -1 : 1))
    .map(([_, foreignWord]) => foreignWord)
    .join(',');
};

module.exports = { countNonAllergens, findCanonicalList };
