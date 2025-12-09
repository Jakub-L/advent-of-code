import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { union } from "@jakub-l/aoc-lib/collections";
import { prod } from "@jakub-l/aoc-lib/math";

// Types
type Point = [number, number];

// Input
const input: Point[] = readFile(__dirname + "/input.txt", ["\n", ","], Number);
const testInput: Point[] = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`
  .split("\n")
  .map(line => line.split(",").map(Number) as Point);

// Part 1
const rectArea = (p1: Point, p2: Point) => {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  return Math.abs(p1[0] - p2[0] + 1) * Math.abs(p1[1] - p2[1] + 1);
};

const findLargestRectangle = (points: Point[]) => 
{
  let maxArea = 0;
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = i + 1; j < points.length; j++) {
      maxArea = Math.max(maxArea, rectArea(points[i], points[j]))
    }
  }
  return maxArea
}

// Results
console.log(findLargestRectangle(input))