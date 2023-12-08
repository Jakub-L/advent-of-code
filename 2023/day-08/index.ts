import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { gcd } from "@jakub-l/aoc-lib/math";

type NodeLabels = { label: string; left: string; right: string };

const [rawInstructions, rawNetwork] = readFile(__dirname + "/input.txt", ["\n\n"]) as string[];

// INPUT PROCESSING
/**
 * Processes a node-describing string into node labels
 * @param {string} nodeString - String describing a node in the form of "label = (left, right)"
 * @returns {NodeLabels} Object containing node labels
 */
const parseNode = (nodeString: string): NodeLabels => {
  const [label, left, right] = nodeString.replaceAll(/=|\(|,|\)/g, "").split(/\s+/);
  return { label, left, right };
};

// const [rawInstructions, rawNetwork] = `LR

// 11A = (11B, XXX)
// 11B = (XXX, 11Z)
// 11Z = (11B, XXX)
// 22A = (22B, XXX)
// 22B = (22C, 22C)
// 22C = (22Z, 22Z)
// 22Z = (22B, 22B)
// XXX = (XXX, XXX)`.split("\n\n");

const instructions = rawInstructions.split("");
const nodeLabels = rawNetwork.split("\n").map(parseNode);

// UTILS
/** Single node in a network */
class Node {
  /** Label of the node */
  label: string;
  /** Left node */
  left: Node | null = null;
  /** Right node */
  right: Node | null = null;

  /**
   * Create a new node
   * @param {string} label - Label of the node
   */
  constructor(label: string) {
    this.label = label;
  }

  /**
   * String representation of the node
   * @returns {string} String representation of the node
   */
  toString(): string {
    return `${this.label} = (${this.left?.label}, ${this.right?.label})`;
  }
}

/** Network of nodes */
class Network {
  /** Map of nodes with their labels as keys */
  private _nodes: Map<string, Node> = new Map();
  /** Instructions for traversing the network */
  private _instructions: string[];

  /**
   * Create a new network
   * @param {NodeLabels[]} nodeLabels - Array of node labels
   * @param {string[]} instructions - Array of instructions
   */
  constructor(nodeLabels: NodeLabels[], instructions: string[]) {
    this._instructions = instructions;
    for (const { label } of nodeLabels) this._addNode(label);
    for (const { label, left, right } of nodeLabels) this._addNodeConnections(label, left, right);
  }

  /**
   * Traverse the network from a starting node to an ending node
   * @param {string} startLabel - Label of the starting node
   * @param {string} endLabel - Label of the ending node
   * @returns {number} Number of steps taken to traverse the network
   */
  traverse(startLabel: string, endLabel: string): number {
    if (!this._nodes.has(startLabel)) throw new Error(`Node ${startLabel} not found`);
    if (!this._nodes.has(endLabel)) throw new Error(`Node ${endLabel} not found`);
    let currentNode = this._nodes.get(startLabel) ?? null;
    let step = 0;
    while (currentNode?.label !== endLabel) {
      const direction = this._instructions[step % this._instructions.length];
      currentNode = (direction === "L" ? currentNode?.left : currentNode?.right) ?? null;
      step++;
    }
    return step;
  }

  /**
   * Traverse the network from all starting nodes to all ending nodes simultaneously
   * 
   * This is done by finding the number of steps needed for each of the starting nodes
   * to reach an ending node and then finding the least common multiple of all of those numbers
   * 
   * @param {string} startNodeEndChar - Last character of the label of the starting nodes
   * @param {string} endNodeEndChar - Last character of the label of the ending nodes
   * @returns {number} Number of steps taken to traverse the network
   */
  simultaneouslyTraverse(startNodeEndChar: string, endNodeEndChar: string) {
    let nodes = Array.from(this._nodes.values()).filter(node => node.label.endsWith(startNodeEndChar));
    const cycleLengths = [];
    for (const node of nodes) {
      let step = 0;
      let currentNode: Node | null = node;
      while (!currentNode?.label.endsWith(endNodeEndChar)) {
        const direction = this._instructions[step % this._instructions.length];
        currentNode = (direction === "L" ? currentNode?.left : currentNode?.right) ?? null;
        step++;
      }
      cycleLengths.push(step);
    }
    return cycleLengths.reduce((acc, e) => (acc * e) / gcd(acc, e), 1);
  }

  /**
   * Adds a node to the network
   * @param {string} label - Label of the node
   */
  private _addNode(label: string) {
    this._nodes.set(label, new Node(label));
  }

  /**
   * Adds connections to a node
   * @param {string} label - Label of the node
   * @param {string} left - Label of the left node
   * @param {string} right - Label of the right node
   */
  private _addNodeConnections(label: string, left: string, right: string) {
    const node = this._nodes.get(label);
    if (!node) throw new Error(`Node ${label} not found`);
    node.left = this._nodes.get(left) ?? null;
    node.right = this._nodes.get(right) ?? null;
  }
}

const network = new Network(nodeLabels, instructions);

// RESULTS
console.log(`Part 1: ${network.traverse("AAA", "ZZZ")}`);
console.log(`Part 2: ${network.simultaneouslyTraverse("A", "Z")}`);
