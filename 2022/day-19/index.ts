/**
 * Solution to Day 19 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/19
 *
 * I couldn't get my original method to work fast enough. This method is based on the code
 * of tymscar: [https://github.com/tymscar/Advent-Of-Code]
 */
import { readInput } from '../utils';

// INPUTS
const blueprints: Blueprint[] = readInput('./day-19/input.txt').map(parseBlueprintString);

// UTILS
type Materials = {
  ore: number;
  clay: number;
  obsidian: number;
  geode: number;
};
type RobotCost = Materials;
type RobotsCount = Materials;
type Blueprint = {
  id: number;
  oreRobot: RobotCost;
  clayRobot: RobotCost;
  obsidianRobot: RobotCost;
  geodeRobot: RobotCost;
};

/**
 * Processes a blueprint string into a Blueprint object
 * @param {string} str - Raw blueprint string to parse
 * @param {number} index - Index of the blueprint in its array
 * @returns {Blueprint} A processed Blueprint object
 */
function parseBlueprintString(str: string, index: number): Blueprint {
  const regex = /(\w+) robot costs (\d+ ore)(?: and (\d+ (?:clay|obsidian)))?/g;
  const result: { [index: string]: Object } = { id: index + 1 };
  for (const [_, type, ...costs] of str.matchAll(regex)) {
    result[`${type}Robot`] = costs
      .filter(e => e)
      .reduce(
        (acc, cost) => {
          const [val, ore] = cost.split(' ');
          return { ...acc, [ore]: Number(val) };
        },
        { ore: 0, clay: 0, obsidian: 0, geode: 0 }
      );
  }
  return result as Blueprint;
}

/**
 * Calculates the maximum number of geodes that could be mined in a specified time, given
 * specific costs of each mining robot.
 * @param {number} time - Number of minutes remaining
 * @param {Blueprint} blueprint - Blueprint object defining the robot costs
 * @param {RobotsCount} [robots={ore:1, clay:0, obsidian:0, geode:0}] - Counts of mining robots
 * @param {Materials} [materials={ore:0, clay:0, obsidian:0, geode:0}] - Materials available for construction
 * @param {number} [currMax=0] - The current maximum known geode number
 * @returns
 */
const getMaxGeodes = (
  time: number,
  blueprint: Blueprint,
  robots: RobotsCount = { ore: 1, clay: 0, obsidian: 0, geode: 0 },
  materials: Materials = { ore: 0, clay: 0, obsidian: 0, geode: 0 },
  currMax: number = 0
): number => {
  /**
   * Checks if a robot can be purchased.
   * @param {string} type - Type of robot to buy
   * @returns {boolean} True if robot can be afforded, false otherwise
   */
  const canBuyRobot = (type: string): boolean => {
    const cost = blueprint[`${type}Robot` as keyof Blueprint];
    for (const [mat, reqVal] of Object.entries(cost)) {
      if (reqVal > materials[mat as keyof Materials]) return false;
    }
    return true;
  };

  /**
   * Calculates the number of minutes needed until all the resources for a particular robot are
   * available, assuming no robots are purchased in the meantime.
   * @param {string} type - Type of robot to buy
   * @returns {number} The number of minutes needed to wait
   */
  const timeUntilEnough = (type: string): number => {
    const cost = blueprint[`${type}Robot` as keyof Blueprint];
    let result = -1;
    for (const [mat, reqVal] of Object.entries(cost)) {
      if (robots[mat as keyof RobotsCount] === 0) continue;
      result = Math.max(
        result,
        Math.ceil(
          (reqVal - materials[mat as keyof Materials]) / robots[mat as keyof RobotsCount]
        )
      );
    }
    return result;
  };

  /**
   * Buys a single robot and then returns the new robots object
   * @param {string} type - Type of robot to buy
   * @returns {RobotsCount} Counts of robots after purchase
   */
  const buyRobot = (type: string): RobotsCount => {
    return { ...robots, [type]: robots[type as keyof RobotsCount] + 1 };
  };

  if (time <= 0) return currMax;
  currMax = Math.max(materials.geode, currMax);

  const maxOreNeeded = Math.max(
    blueprint.oreRobot.ore,
    blueprint.clayRobot.ore,
    blueprint.obsidianRobot.ore,
    blueprint.geodeRobot.ore
  );

  if (robots.obsidian > 0) {
    // See how long you'd need to wait for a geode robot, wait that long and then buy the robot.
    const timeUntilEnoughResources = timeUntilEnough('geode');
    const totalTime = 1 + (canBuyRobot('geode') ? 0 : timeUntilEnoughResources);

    const newMaterials = {
      ...materials,
      ore: materials.ore + totalTime * robots.ore - blueprint.geodeRobot.ore,
      clay: materials.clay + totalTime * robots.clay,
      obsidian:
        materials.obsidian + totalTime * robots.obsidian - blueprint.geodeRobot.obsidian,
      geode: materials.geode + time - totalTime
    };

    currMax = Math.max(
      getMaxGeodes(time - totalTime, blueprint, robots, newMaterials, currMax),
      currMax
    );

    if (canBuyRobot('geode')) return currMax;
  }
  if (robots.clay > 0) {
    // See how long you'd need to wait for an obsidian robot, wait that long and then buy the robot.
    const timeUntilEnoughResources = timeUntilEnough('obsidian');
    const totalTime = 1 + (canBuyRobot('obsidian') ? 0 : timeUntilEnoughResources);

    if (time - totalTime > 2) {
      const newMaterials = {
        ...materials,
        ore: materials.ore + totalTime * robots.ore - blueprint.obsidianRobot.ore,
        clay: materials.clay + totalTime * robots.clay - blueprint.obsidianRobot.clay,
        obsidian: materials.obsidian + totalTime * robots.obsidian
      };

      currMax = Math.max(
        getMaxGeodes(time - totalTime, blueprint, buyRobot('obsidian'), newMaterials, currMax)
      );
    }
  }
  if (robots.clay < blueprint.obsidianRobot.clay) {
    // See how long you'd need to wait for a clay robot, wait that long and then buy the robot.
    const timeUntilEnoughOre = timeUntilEnough('clay');
    const totalTime = 1 + (canBuyRobot('clay') ? 0 : timeUntilEnoughOre);

    if (time - totalTime > 3) {
      const newMaterials = {
        ...materials,
        ore: materials.ore + totalTime * robots.ore - blueprint.clayRobot.ore,
        clay: materials.clay + totalTime * robots.clay,
        obsidian: materials.obsidian + totalTime * robots.obsidian
      };

      currMax = Math.max(
        getMaxGeodes(time - totalTime, blueprint, buyRobot('clay'), newMaterials, currMax)
      );
    }
  }
  if (robots.ore < maxOreNeeded) {
    // See how long you'd need to wait for an ore robot, wait that long and then buy the robot.
    const timeUntilEnoughOre = timeUntilEnough('ore');
    const totalTime = 1 + (canBuyRobot('ore') ? 0 : timeUntilEnoughOre);

    // We need at least 5 seconds after this purchase to make any geodes:
    // 1. Build ore robot
    // 2. Build clay robot
    // 3. Build obsidian robot
    // 4. Build geode robot
    // 5. Mine first geode
    // If we don't have that time we might as well prune the path as we won't gain more geodes.
    // This applies to all above paths as well
    if (time - totalTime > 4) {
      const newMaterials = {
        ...materials,
        ore: materials.ore + totalTime * robots.ore - blueprint.oreRobot.ore,
        clay: materials.clay + totalTime * robots.clay,
        obsidian: materials.obsidian + totalTime * robots.obsidian
      };

      currMax = Math.max(
        getMaxGeodes(time - totalTime, blueprint, buyRobot('ore'), newMaterials, currMax)
      );
    }
  }
  return currMax;
};

// PART 1
const part1 = blueprints.reduce(
  (sum, blueprint) => sum + blueprint.id * getMaxGeodes(24, blueprint),
  0
);

// PART 2
const part2 = blueprints
  .slice(0, 3)
  .reduce((prod, blueprint) => prod * getMaxGeodes(32, blueprint), 1);

// RESULTS
console.log(`Solution to Part 1: ${part1}`);
console.log(`Solution to Part 2: ${part2}`);
