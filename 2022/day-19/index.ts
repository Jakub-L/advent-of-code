/**
 * Solution to Day 19 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/19
 */
import { readInput } from '../utils';

// INPUTS
const robotCosts: string[] = readInput('./day-19/input.txt');

// UTILS
type Resources = { ore: number; clay: number; obsidian: number; geodes: number };
type Robots = Resources;

class RobotCosts {
  oreRobot: Resources = { ore: 0, clay: 0, obsidian: 0, geodes: 0 };
  clayRobot: Resources = { ore: 0, clay: 0, obsidian: 0, geodes: 0 };
  obsidianRobot: Resources = { ore: 0, clay: 0, obsidian: 0, geodes: 0 };
  geodeRobot: Resources = { ore: 0, clay: 0, obsidian: 0, geodes: 0 };
  mostExpensive: Resources;

  constructor(blueprintString: string) {
    const parsed = this._parseString(blueprintString);
    this.oreRobot = parsed.ore;
    this.clayRobot = parsed.clay;
    this.obsidianRobot = parsed.obsidian;
    this.geodeRobot = parsed.geode;
    this.mostExpensive = this._getMostExpensive();
  }

  private _getMostExpensive(): Resources {
    return this._robots.reduce(
      (acc, robot) => {
        let type: keyof Resources;
        for (type in robot) {
          acc[type] = Math.max(acc[type], robot[type]);
        }
        return acc;
      },
      { ore: 0, clay: 0, obsidian: 0, geodes: 0 }
    );
  }

  private get _robots(): Resources[] {
    return [this.oreRobot, this.clayRobot, this.obsidianRobot, this.geodeRobot];
  }

  private _parseString(blueprintString: string): { [index: string]: Resources } {
    const regex = /(\w+) robot costs (\d+ ore)(?: and (\d+ (?:clay|obsidian)))?/g;
    const result: { [index: string]: Resources } = {};
    for (const [_, type, ...costs] of blueprintString.matchAll(regex)) {
      result[type] = costs
        .filter(e => e)
        .reduce(
          (acc, cost) => {
            const [val, ore] = cost.split(' ');
            return { ...acc, [ore]: Number(val) };
          },
          { ore: 0, clay: 0, obsidian: 0, geodes: 0 } as Resources
        );
    }
    return result;
  }
}

class Blueprint {
  costs: RobotCosts;
  maxTime: number;
  private _id: number;
  private _maxGeodes: number = -1;

  constructor(blueprintString: string, maxTime: number, id: number) {
    this.costs = new RobotCosts(blueprintString);
    this.maxTime = maxTime;
    this._id = id;
  }

  get maxGeodes(): number {
    if (this._maxGeodes < 0) this._maxGeodes = this._solve();
    return this._maxGeodes;
  }

  get quality(): number {
    if (this._maxGeodes < 0) this._maxGeodes = this._solve();
    return this._maxGeodes * this._id;
  }

  private _solve() {
    let best = 0;
    const initialState: [Resources, Robots, number] = [
      { ore: 0, clay: 0, obsidian: 0, geodes: 0 },
      { ore: 1, clay: 0, obsidian: 0, geodes: 0 },
      24
    ];
    let queue = [initialState];
    const memo: Set<string> = new Set();

    while (queue.length > 0) {
      const state = queue.shift() as [Resources, Robots, number];
      const [res, rob, t] = state;
      best = Math.max(best, res.geodes);
      if (t === 0) continue;

      if (rob.ore >= this.costs.mostExpensive.ore) {
        rob.ore = this.costs.mostExpensive.ore;
      }
      if (rob.clay >= this.costs.mostExpensive.clay) {
        rob.clay = this.costs.mostExpensive.clay;
      }
      if (rob.obsidian >= this.costs.mostExpensive.obsidian) {
        rob.obsidian = this.costs.mostExpensive.obsidian;
      }

      if (res.ore >= t * this.costs.mostExpensive.ore - rob.ore * (t - 1)) {
        res.ore = t * this.costs.mostExpensive.ore - rob.ore * (t - 1);
      }
      if (res.clay >= t * this.costs.mostExpensive.clay - rob.clay * (t - 1)) {
        res.clay = t * this.costs.mostExpensive.clay - rob.clay * (t - 1);
      }
      if (res.obsidian >= t * this.costs.mostExpensive.obsidian - rob.obsidian * (t - 1)) {
        res.obsidian = t * this.costs.mostExpensive.obsidian - rob.obsidian * (t - 1);
      }

      const key = `${Object.values(res)},${Object.values(rob)},t`;
      if (memo.has(key)) continue;
      memo.add(key);

      if (memo.size % 1000000 === 0) console.log(t, best, memo.size);
      queue = queue.concat(this._getVariations(res, rob, t));
    }
    return best;
  }

  private _getVariations(res: Resources, rob: Robots, t: number) {
    const result = [
      [
        {
          ore: res.ore + rob.ore,
          clay: res.clay + rob.clay,
          obsidian: res.obsidian + rob.obsidian,
          geodes: res.geodes + rob.geodes
        },
        { ...rob },
        t - 1
      ]
    ];
    if (res.ore >= this.costs.oreRobot.ore) {
      result.push([
        {
          ore: res.ore + rob.ore - this.costs.oreRobot.ore,
          clay: res.clay + rob.clay,
          obsidian: res.obsidian + rob.obsidian,
          geodes: res.geodes + rob.geodes
        },
        { ...rob, ore: rob.ore + 1 },
        t - 1
      ]);
    }
    if (res.ore >= this.costs.clayRobot.ore) {
      result.push([
        {
          ore: res.ore + rob.ore - this.costs.clayRobot.ore,
          clay: res.clay + rob.clay,
          obsidian: res.obsidian + rob.obsidian,
          geodes: res.geodes + rob.geodes
        },
        { ...rob, clay: rob.clay + 1 },
        t - 1
      ]);
    }
    if (res.ore >= this.costs.obsidianRobot.ore && res.clay >= this.costs.obsidianRobot.clay) {
      result.push([
        {
          ore: res.ore + rob.ore - this.costs.obsidianRobot.ore,
          clay: res.clay + rob.clay - this.costs.obsidianRobot.clay,
          obsidian: res.obsidian + rob.obsidian,
          geodes: res.geodes + rob.geodes
        },
        { ...rob, obsidian: rob.obsidian + 1 },
        t - 1
      ]);
    }
    if (
      res.ore >= this.costs.geodeRobot.ore &&
      res.obsidian >= this.costs.geodeRobot.obsidian
    ) {
      result.push([
        {
          ore: res.ore + rob.ore - this.costs.geodeRobot.ore,
          clay: res.clay + rob.clay,
          obsidian: res.obsidian + rob.obsidian - this.costs.geodeRobot.obsidian,
          geodes: res.geodes + rob.geodes
        },
        { ...rob, geodes: rob.geodes + 1 },
        t - 1
      ]);
    }
    return result as [Resources, Robots, number][];
  }
}

// PART 1
// let part1 = robotCosts.reduce((sum, rC, i) => {
//   const blueprint = new Blueprint(rC, 24, i + 1);
//   return sum + blueprint.quality;
// }, 0);

// PART 2
let part2 = robotCosts.slice(0, 3).reduce((product, rC, i) => {
  const blueprint = new Blueprint(rC, 32, i + 1);
  console.log(blueprint.maxGeodes);
  return product * blueprint.maxGeodes;
}, 1);

// RESULTS
// console.log(`Part 1 solution: ${part1}`);
console.log(`Part 2 solution: ${part2}`);
