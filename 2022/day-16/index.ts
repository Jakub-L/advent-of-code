/**
 * Solution to Day 16 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/16
 */
import { readInput } from '../utils';

// INPUTS
const valveDefinitions: ValveDefinition[] =
  readInput('./day-16/input.txt').map(parseValveDefinition);

// UTILS
type ValveDefinition = { name: string; flow: number; connections: string[] };
type Distance1D = { [index: string]: number };

/**
 * Parses a string valve definition to an object
 * @param {string} definition - String defining valve, its flow and connections
 * @returns {Object} Object containing the name, flow and connected valves
 */
function parseValveDefinition(definition: string): ValveDefinition {
  const [_, name, flow, connections] = definition.match(
    /([A-Z]{2})\D*(\d+)[;a-z ]*([\w, ]+)/
  ) as RegExpMatchArray;
  return { name, flow: Number(flow), connections: connections.split(', ') };
}

/** Network of valves connected by tunnels */
class Network {
  /** Dictionary of all valves and their flows */
  allValves: { [index: string]: number } = {};
  /** Array of valve names for valves with nonzero flow */
  valvesWithFlow: string[] = [];
  /** Object of distances between any two nodes on the network */
  distances: { [index: string]: Distance1D } = {};
  count: number = 0

  /**
   * Creates a new network
   * @param {ValveDefinition[]} valveDefinitions - Array of valve definition objects
   */
  constructor(valveDefinitions: ValveDefinition[]) {
    for (const { name, flow, connections } of valveDefinitions) {
      this.allValves[name] = flow;
      this.distances[name] = connections.reduce((acc, c) => ({ ...acc, [c]: 1 }), {});
      if (flow > 0) this.valvesWithFlow.push(name);
    }
    this.computeDistances();
  }

  /**
   * Finds the highest flow that can be achieved in a network
   * @param {number} timeLeft - Time remaining before explosion
   * @param {boolean} [elephant=false] - Whether the elephant is yet to act
   * @param {string[]} [toCheck=this.valvesWithFlow] - Valve names to still check
   * @param {Object.<string, number>} [memo={}] - Memoization object
   * @param {string} current - The name of the currently inspected valve
   * @returns {number} The maximum flow achievable with given inputs
   */
  findBestFlow(
    timeLeft: number,
    elephant: boolean = false,
    toCheck: string[] = this.valvesWithFlow,
    memo: { [index: string]: number } = {},
    current: string = 'AA'
  ): number {
    const key = `${current}-${timeLeft}-${toCheck.sort()}-${elephant}`;
    let result = 0;
    this.count++
    if (key in memo) return memo[key];
    for (const valve of toCheck) {
      const travelTime = this.distances[current][valve];
      const flow = this.allValves[valve];
      if (travelTime < timeLeft) {
        const newTime = timeLeft - travelTime - 1;
        const newToCheck = toCheck.filter(e => e !== valve);
        result = Math.max(
          result,
          flow * newTime + this.findBestFlow(newTime, elephant, newToCheck, memo, valve)
        );
      }
    }
    result = Math.max(result, elephant ? this.findBestFlow(26, false, toCheck, memo) : 0);
    memo[key] = result;
    return result;
  }

  /** Precomputes distances between valves, using the Floyd-Warshall algorithm */
  private computeDistances() {
    for (const k in this.allValves) {
      for (const i in this.allValves) {
        for (const j in this.allValves) {
          this.distances[i][j] = Math.min(this.dist(i, j), this.dist(i, k) + this.dist(k, j));
        }
      }
    }
  }

  /**
   * Finds the precomputed distance between two valves
   * @param {string} from - Name of the origin valve
   * @param {string} to - Name of target valve
   * @returns {number} Distance between two valves, if precomputed, Infinity otherwise
   */
  private dist(from: string, to: string): number {
    return this.distances?.[from]?.[to] ?? Infinity;
  }
}

// PART 1 & 2
const pipes = new Network(valveDefinitions);

// RESULTS
console.log(`Part 1 solution: ${pipes.findBestFlow(30)}`);
console.log(`Part 2 solution: ${pipes.findBestFlow(26, true)}`);
