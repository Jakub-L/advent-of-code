import { readFile } from "@jakub-l/aoc-lib/input-parsing";

type Map = { destination: number; source: number; length: number };
type SeedPair = { start: number; length: number };
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

const applyMapsToSeeds = (seeds: number[], categories: Category[]): number[] => {
  const finalLocations: number[] = [];
  for (const seed of seeds) {
    finalLocations.push(getFinalLocation(seed, categories));
  }
  return finalLocations;
};

const findMinimumLocation = (seedPairs: SeedPair[], categories: Category[]): number => {
  // First step over in interval of 100s to find likely minimum
  const pairMinimums = [];
  for (const seedPair of seedPairs) {
    let minimumLocation = Infinity;
    let minimumSeed = seedPair.start;
    for (let i = seedPair.start; i < seedPair.start + seedPair.length; i += 100) {
      const finalLocation = getFinalLocation(i, categories);
      if (finalLocation < minimumLocation) {
        minimumLocation = finalLocation;
        minimumSeed = i;
      }
    }
    pairMinimums.push({ start: seedPair.start, minimumSeed, minimumLocation, length: seedPair.length });
  }

  console.log(pairMinimums);

  // Find the minimum of the 100-step minimums
  let likelyMinimumLocation = Infinity;
  let pairOfInterest = { start: 0, minimumSeed: 0, minimumLocation: 0, length: 0 };
  for (const pair of pairMinimums) {
    if (pair.minimumLocation < likelyMinimumLocation) {
      likelyMinimumLocation = pair.minimumLocation;
      pairOfInterest = pair;
    }
  }

  // Search around the likely minimum to find the actual minimum
  let minimumLocation = Infinity;
  let searchBand = 1_000_000;
  let lowerBound = Math.max(pairOfInterest.minimumSeed - searchBand, pairOfInterest.start);
  let upperBound = Math.min(pairOfInterest.minimumSeed + searchBand, pairOfInterest.start + pairOfInterest.length);
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
