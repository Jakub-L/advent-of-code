import { intersection } from "@jakub-l/aoc-lib/collections";
import { Queue } from "@jakub-l/aoc-lib/data-structures";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// Types
/**
 * A node in the clique generating queue.
 * A clique is a subset of a graph such that every two nodes
 * in the clique are connected to one another.
 */
type CliqueNode = {
  /** The current clique */
  clique: string[];
  /** Set of common neighbours of the nodes in the base */
  commonNeighbors: Node[];
};

// Inputs
const input: string[][] = readFile(`${__dirname}/input.txt`, ["\n", "-"]) as string[][];

// Part 1
/** A node in a graph, representing a computer */
class Node {
  /** The ID of the computer */
  public id: string;
  /** The computers this computer is connected to */
  public neighbors: Record<string, Node> = {};

  /**
   * Create a new computer node
   * @param {string} id - The ID of the computer
   */
  constructor(id: string) {
    this.id = id;
  }

  /**
   * Connect this computer to another computer. This is not a
   * directed connection, A -> B is the same as B -> A.
   *
   * @param {Node} node - The computer to connect to
   */
  public connect(node: Node) {
    this.neighbors[node.id] = node;
    node.neighbors[this.id] = this;
  }
}

/** An undirected graph of all computers */
class Graph {
  /** The computers in the graph, keyed by their ID */
  private _nodes: Map<string, Node> = new Map();
  /** Potential historian computers, with IDs that start with 't' */
  private _tComputers: Set<string> = new Set();

  /**
   * Create a new graph of computers
   * @param {string[][]} connections - A list of pairs of computer IDs that are connected
   */
  constructor(connections: string[][]) {
    for (const [id1, id2] of connections) {
      this._connect(id1, id2);
      if (id1.startsWith("t")) this._tComputers.add(id1);
      if (id2.startsWith("t")) this._tComputers.add(id2);
    }
  }

  /**
   * Add a new computer to the graph
   * @param {string} id - The ID of the computer
   * @returns {Node} The new computer node
   */
  private _addNode(id: string): Node {
    this._nodes.set(id, new Node(id));
    return this._nodes.get(id)!;
  }

  /**
   * Connect two computers in the graph. If either computer does not exist,
   * it will be created.
   * @param {string} id1 - The ID of the first computer
   * @param {string} id2 - The ID of the second computer
   */
  private _connect(id1: string, id2: string) {
    const node1 = this.getNode(id1) ?? this._addNode(id1);
    const node2 = this.getNode(id2) ?? this._addNode(id2);
    node1.connect(node2);
  }

  /**
   * Get a computer node by its ID
   * @param {string} id - The ID of the computer
   * @returns {Node} The computer node
   */
  public getNode(id: string) {
    return this._nodes.get(id);
  }

  /**
   * Get all possible historian-containing networks of a given size.
   * A historian-containing network is a clique of computers that
   * contains at least one historian computer (ID starts with 't').
   *
   * @param {number} [size=3] - The size of the clique
   * @returns {string[][]} An array of historian-containing networks
   */
  public getHistorianNetworks(size: number = 3): string[][] {
    const result = [];
    for (const clique of getCliques(this)) {
      // Since cliques are generated in ascending order of size,
      // if we hit size + 1, we can stop.
      if (clique.length > size) return result;
      if (clique.length === size) {
        // Find if the set of clique computers and the set of historian computers
        // have a non-empty intersection (i.e. share at least one computer).
        const cliqueSet = new Set(clique);
        if (intersection(cliqueSet, this._tComputers).size > 0) {
          result.push(clique);
        }
      }
    }
    return result;
  }

  /**
   * Get the password for the LAN party. The password is the comma-separated,
   * alphabetically sorted list of computers in the largest clique.
   */
  get lanPartyPassword(): string {
    let largestClique: string[] = [];
    for (const clique of getCliques(this)) largestClique = clique;
    return largestClique.sort().join(",");
  }

  /** The IDs of computers/vertices/nodes in the graph */
  get vertices(): string[] {
    return Array.from(this._nodes.keys());
  }
}

/**
 * Generates all cliques in a graph. These are sorted by size, and within each size,
 * they are generated in whatever order the graph vertices are returned.
 *
 * This algorithm is a TypeScript implementation of the enumerate_all_cliques function
 * from the NetworkX library.
 * @generator
 * @param {Graph} graph - The graph to generate cliques for
 * @yields {string[]} A clique in the graph
 */
function* getCliques(graph: Graph): Generator<string[], void, unknown> {
  const index: Record<string, number> = {};
  const nbors: Record<string, Node[]> = {};
  const vertices = graph.vertices;

  // The index of each vertex ID is its position in the vertices array, or
  // the "iteration order". The nbors object contains the neighbors of each
  // vertex that appear later in the iteration order.
  for (let i = 0; i < vertices.length; i++) {
    const node = graph.getNode(vertices[i])!;
    const neighbors = Object.values(node.neighbors);
    index[node.id] = i;
    nbors[node.id] = neighbors.filter(n => !(n.id in index));
  }

  // Each node is defined in terms of its the current clique and the
  // common neighbors of all nodes in the base. The common neighbors are sorted
  // by the iteration order.
  const initialQueue: CliqueNode[] = vertices.map(nodeId => ({
    clique: [nodeId],
    commonNeighbors: nbors[nodeId].sort((a, b) => index[a.id] - index[b.id])
  }));

  const queue = new Queue(initialQueue);
  while (!queue.isEmpty) {
    const { clique, commonNeighbors } = queue.dequeue();
    yield clique;
    for (let i = 0; i < commonNeighbors.length; i++) {
      const nextNode = commonNeighbors[i];
      const newBase = [...clique, nextNode.id];
      // Slice the commonNeighbors to remove the candidate for the next node and then filter
      // the remaining nodes to only include those, that are neighbors of the next node
      // (since they were already common to the base, this means they are now common to
      // the new base).
      const newCnbrs = commonNeighbors.slice(i + 1).filter(n => nbors[nextNode.id].includes(n));
      queue.enqueue({ clique: newBase, commonNeighbors: newCnbrs });
    }
  }
}

// Results
console.time("Construct");
const network = new Graph(input);
console.timeEnd("Construct");
console.time("Part 1");
console.log(network.getHistorianNetworks(3).length);
console.timeEnd("Part 1");
console.time("Part 2");
console.log(network.lanPartyPassword);
console.timeEnd("Part 2");
