import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// Types
type Region = {
  width: number;
  height: number;
  shapes: number[];
};

type Shape = Set<string>;

// Input
const input: string[] = readFile(__dirname + "/input.txt", ["\n\n"]);
const shapes = input.slice(0, 6).map(parseShape);
const regions = input[6].split("\n").map(parseRegion);

function parseRegion(str: string): Region {
  const [areaStr, shapesStr] = str.split(": ");
  const [width, height] = areaStr.split("x").map(Number);
  const shapes = shapesStr.split(" ").map(Number);
  return { width, height, shapes };
}

function parseShape(str: string): Shape {
  const fields = str.split("\n").slice(1);
  const occupied = new Set<string>();

  for (let row = 0; row < fields.length; row++) {
    for (let col = 0; col < fields[row].length; col++) {
      if (fields[row][col] === "#") occupied.add(`${row},${col}`);
    }
  }

  return occupied;
}

console.log(shapes);

// Part 1
const area = (region: Region): number => region.width * region.height;

const canRegionFit = (region: Region): boolean => {
  const totalArea = area(region);

  const maximumShapesArea = region.shapes.reduce((acc, n) => acc + n * 9, 0);
  const minimumShapesArea = region.shapes.reduce((acc, n, i) => acc + n * shapes[i].size, 0);
  console.log({ region, totalArea, maximumShapesArea, minimumShapesArea });

  if (totalArea >= maximumShapesArea) return true;
  if (totalArea < minimumShapesArea) return false;

  return false;
};

// Results
console.log(`Part 1: ${regions.map(canRegionFit).filter(Boolean).length}`);
