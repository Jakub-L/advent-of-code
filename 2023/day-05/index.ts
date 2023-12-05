import { readFile } from "@jakub-l/aoc-lib/input-parsing";

type Map = { destination: number; source: number; length: number };
type Category = Map[];

const input: string[] = readFile(__dirname + "/input.txt", ["\n\n"]) as string[];

// const input = `seeds: 79 14 55 13

// seed-to-soil map:
// 50 98 2
// 52 50 48

// soil-to-fertilizer map:
// 0 15 37
// 37 52 2
// 39 0 15

// fertilizer-to-water map:
// 49 53 8
// 0 11 42
// 42 0 7
// 57 7 4

// water-to-light map:
// 88 18 7
// 18 25 70

// light-to-temperature map:
// 45 77 23
// 81 45 19
// 68 64 13

// temperature-to-humidity map:
// 0 69 1
// 1 0 69

// humidity-to-location map:
// 60 56 37
// 56 93 4`.split("\n\n");

// INPUT PARSING
const parseSeeds = (str: string): number[] => str.replace("seeds: ", "").split(" ").map(Number);
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
const categories = rawCategories.map(parseCategory);

// UTILS
const applyMaps = (seeds: number[], categories: Category[]): number[] => {
  const finalLocations: number[] = [];
  for (const seed of seeds) {
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
    finalLocations.push(currentLocation);
  }
  return finalLocations;
};

// RESULTS
console.log(`Part 1: ${Math.min(...applyMaps(seeds, categories))}`);
