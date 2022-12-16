/**
 * Solution to Day 16 challenge of Advent of Code 2022
 * https://adventofcode.com/2022/day/16
 */
import { readInput } from '../utils';

// INPUTS
const valveDefinitions: ValveDefinition[] =
  readInput('./day-16/input.txt').map(parseValveDefinition);

// const valveDefinitions: ValveDefinition[] =
//   `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
// Valve BB has flow rate=13; tunnels lead to valves CC, AA
// Valve CC has flow rate=2; tunnels lead to valves DD, BB
// Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
// Valve EE has flow rate=3; tunnels lead to valves FF, DD
// Valve FF has flow rate=0; tunnels lead to valves EE, GG
// Valve GG has flow rate=0; tunnels lead to valves FF, HH
// Valve HH has flow rate=22; tunnel leads to valve GG
// Valve II has flow rate=0; tunnels lead to valves AA, JJ
// Valve JJ has flow rate=21; tunnel leads to valve II`
//     .split('\n')
//     .map(parseValveDefinition);

// UTILS
type ValveDefinition = { name: string; flow: number; connections: string[] };

function parseValveDefinition(definition: string): ValveDefinition {
  const [_, name, flow, connections] = definition.match(
    /([A-Z]{2})\D*(\d+)[;a-z ]*([\w, ]+)/
  ) as RegExpMatchArray;
  return { name, flow: Number(flow), connections: connections.split(', ') };
}

class Valve {
  name: string;
  flow: number;
  connections: Valve[] = [];

  constructor(name: string, flow: number) {
    this.name = name;
    this.flow = flow;
  }
}

class Network {
  root: Valve;
  valves: { [index: string]: Valve } = {};
  count: number = 0

  constructor(valveDefinitions: ValveDefinition[]) {
    for (const { name, flow } of valveDefinitions) {
      this.valves[name] = new Valve(name, flow);
    }
    for (const { name, connections } of valveDefinitions) {
      this.valves[name].connections = connections.map(name => this.valves[name]);
    }
    this.root = this.valves['AA'];
  }

  findBestFlow(
    timeLeft: number,
    extraPlayers: number = 0,
    opened: Set<string> = new Set(),
    memo: { [index: string]: number } = {},
    current: Valve = this.root
  ): number {
    let result = 0;
    const key = `${current.name} - ${timeLeft} - ${Array.from(opened.values())
      .sort()
      .join()} - ${extraPlayers}`;
    if (timeLeft === 0) {
      return extraPlayers > 0 ? this.findBestFlow(26, extraPlayers - 1, opened, memo) : 0;
    }
    if (key in memo) return memo[key];
    if (!opened.has(current.name) && current.flow > 0) {
      const newOpened = new Set(opened);
      newOpened.add(current.name);
      result = Math.max(
        result,
        (timeLeft - 1) * current.flow +
          this.findBestFlow(timeLeft - 1, extraPlayers, newOpened, memo, current)
      );
    }
    for (const neighbour of current.connections) {
      result = Math.max(
        result,
        this.findBestFlow(timeLeft - 1, extraPlayers, opened, memo, neighbour)
      );
    }
    memo[key] = result;
    console.log(++this.count);
    return result;
  }
}

// PART 1
const part1 = new Network(valveDefinitions);
const part2 = new Network(valveDefinitions);

// PART 2

// RESULTS
// console.log(part1.findBestFlow(30));
console.log(part2.findBestFlow(26, 1));
