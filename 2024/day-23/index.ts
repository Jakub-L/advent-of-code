import { difference, intersection, union } from "@jakub-l/aoc-lib/collections";
import { MinHeap, Queue } from "@jakub-l/aoc-lib/data-structures";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// Types
/** A node in the clique generating queue */
type CliqueNode = {
  /** The clique */
  base: string[];
  /** Set of common neighbours of the nodes in the base */
  cnbrs: Node[];
};

// Constants

// Inputs
const input: string[][] = readFile(`${__dirname}/input.txt`, ["\n", "-"]);
const sample: string[][] = `kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`
  .split("\n")
  .map(line => line.split("-"));

// Part 1
class Node {
  public id: string;
  public neighbors: Map<string, Node> = new Map();

  constructor(id: string) {
    this.id = id;
  }

  public connect(node: Node) {
    this.neighbors.set(node.id, node);
    node.neighbors.set(this.id, this);
  }
}

class Graph {
  public _nodes: Map<string, Node> = new Map();
  public _tComputers: Set<string> = new Set();

  constructor(connections?: string[][]) {
    if (connections) {
      for (const [id1, id2] of connections) {
        this.connect(id1, id2);
        if (id1.startsWith("t")) this._tComputers.add(id1);
        if (id2.startsWith("t")) this._tComputers.add(id2);
      }
    }
  }

  public addNode(id: string): Node {
    this._nodes.set(id, new Node(id));
    return this._nodes.get(id)!;
  }

  public getNode(id: string) {
    return this._nodes.get(id);
  }

  public connect(id1: string, id2: string) {
    const node1 = this.getNode(id1) ?? this.addNode(id1);
    const node2 = this.getNode(id2) ?? this.addNode(id2);
    node1.connect(node2);
  }

  public getHistorianNetworks(size: number = 3): string[][] {
    const result = [];
    for (const clique of getCliques(this)) {
      if (clique.length > size) return result;
      if (clique.length === size) {
        const cliqueSet = new Set(clique);
        if (intersection(cliqueSet, this._tComputers).size > 0) {
          result.push(clique);
        }
      }
    }
    return result;
  }

  get vertices(): string[] {
    return Array.from(this._nodes.keys());
  }
}

function* getCliques(graph: Graph) {
  const index: Record<string, number> = {};
  const neighbors: Record<string, Node[]> = {};
  const vertices = graph.vertices;

  for (let i = 0; i < vertices.length; i++) {
    const node = graph.getNode(vertices[i])!;
    index[node.id] = i;
    neighbors[node.id] = Array.from(node.neighbors.values()).filter(n => !(n.id in index));
  }

  const initialQueue = vertices.map(vId => ({
    base: [vId],
    cnbrs: neighbors[vId].sort((a, b) => index[a.id] - index[b.id])
  }));

  const queue = new Queue(initialQueue);
  while (!queue.isEmpty) {
    const { base, cnbrs } = queue.dequeue();
    yield base;
    for (let i = 0; i < cnbrs.length; i++) {
      const nextNode = cnbrs[i];
      const newBase = [...base, nextNode.id];
      const newCnbrs = cnbrs.slice(i + 1).filter(n => neighbors[nextNode.id].includes(n));
      queue.enqueue({ base: newBase, cnbrs: newCnbrs });
    }
  }
}

// Results
const network = new Graph(input);
// console.log(network.getNode("kh"));
console.log(network.getHistorianNetworks(3).length);
