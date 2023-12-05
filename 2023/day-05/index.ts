import { readFile } from "@jakub-l/aoc-lib/input-parsing";

type Map = { destination: number; source: number; length: number };
type SeedPair = { start: number; length: number };
type PotentialPairMinimum = {
  intervalStart: number;
  minimumCandidateSeed: number;
  minimumCandidateLocation: number;
  intervalLength: number;
};
type Category = Map[];

const input: string[] = readFile(__dirname + "/input.txt", ["\n\n"]) as string[];

// INPUT PARSING
const parseSeeds = (str: string): number[] => str.replace("seeds: ", "").split(" ").map(Number);
const parseSeedPairs = (str: string): SeedPair[] =>
  (str.match(/\d+ \d+/g) as string[]).map(pair => {
    const [start, length] = pair.split(" ").map(Number);
    return { start, length };
  });
const parseCategory = (str: string): Category =>
  str
    .replace(/.*map:\n/, "")
    .split("\n")
    .map(map => {
      const [destination, source, length] = map.split(" ").map(Number);
      return { destination, source, length };
    });

const [rawSeeds, ...rawCategories] = input;
const seeds = parseSeeds(rawSeeds);
const seedPairs = parseSeedPairs(rawSeeds);
const categories = rawCategories.map(parseCategory);

// UTILS
/**
 * Processes a seed through categories to find its final location
 * @param {number} seed - The initial seed
 * @param {Category[]} categories - The categories containing mappings
 * @returns {number} The final location of the seed
 */
const getFinalLocation = (seed: number, categories: Category[]): number => {
  let currentLocation = seed;
  for (const category of categories) {
    for (const map of category) {
      const { destination, source, length } = map;
      if (currentLocation >= source && currentLocation <= source + length - 1) {
        currentLocation = destination + (currentLocation - source);
        break;
      }
    }
  }
  return currentLocation;
};

/**
 * Processes all seeds to find their final locations
 * @param {number[]} seeds - Array of initial seeds
 * @param {Category[]} categories - The categories containing mappings
 * @returns {number[]} The final location of each seed
 */
const applyMapsToSeeds = (seeds: number[], categories: Category[]): number[] => {
  const finalLocations: number[] = [];
  for (const seed of seeds) {
    finalLocations.push(getFinalLocation(seed, categories));
  }
  return finalLocations;
};

/**
 * Finds the minimum location assuming seed ranges are used
 * @param {SeedPair[]} seedPairs - Array of seed pairs
 * @param {Category[]} categories - The categories containing mappings
 * @returns {number} The minimum location
 */
const findMinimumLocation = (seedPairs: SeedPair[], categories: Category[]): number => {
  // First step over in interval of 100s to find likely minimum
  const seedPairMiniums: PotentialPairMinimum[] = [];
  for (const seedPair of seedPairs) {
    let minimumCandidateLocation = Infinity;
    let minimumCandidateSeed = seedPair.start;
    for (let i = seedPair.start; i < seedPair.start + seedPair.length; i += 100) {
      const finalLocation = getFinalLocation(i, categories);
      if (finalLocation < minimumCandidateLocation) {
        minimumCandidateLocation = finalLocation;
        minimumCandidateSeed = i;
      }
    }
    seedPairMiniums.push({
      intervalStart: seedPair.start,
      minimumCandidateSeed,
      minimumCandidateLocation,
      intervalLength: seedPair.length
    });
  }

  // Find the pair with the lowest 100-interval minimum
  let likelyMinimumLocation = Infinity;
  let pairOfInterest: PotentialPairMinimum = {
    intervalStart: 0,
    minimumCandidateSeed: 0,
    minimumCandidateLocation: 0,
    intervalLength: 0
  };
  for (const pair of seedPairMiniums) {
    if (pair.minimumCandidateLocation < likelyMinimumLocation) {
      likelyMinimumLocation = pair.minimumCandidateLocation;
      pairOfInterest = pair;
    }
  }

  // Search around the likely minimum seed to find the actual minimum
  const { minimumCandidateSeed, intervalStart, intervalLength } = pairOfInterest;
  let minimumLocation = Infinity;
  let searchBand = 1_000_000;
  let lowerBound = Math.max(minimumCandidateSeed - searchBand, intervalStart);
  let upperBound = Math.min(minimumCandidateSeed + searchBand, intervalStart + intervalLength);
  for (let i = lowerBound; i < upperBound; i++) {
    const finalLocation = getFinalLocation(i, categories);
    if (finalLocation < minimumLocation) {
      minimumLocation = finalLocation;
    }
  }

  return minimumLocation;
};

// RESULTS
console.log(`Part 1: ${Math.min(...applyMapsToSeeds(seeds, categories))}`);
console.log(`Part 2: ${findMinimumLocation(seedPairs, categories)}`);
