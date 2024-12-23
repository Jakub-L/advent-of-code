import { difference, intersection, union } from "@jakub-l/aoc-lib/collections";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// Types
type Network = Set<string>;

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
class LocalNetwork {
  public _directConnections: Record<string, Network> = {};
  public _tComputers: Set<string> = new Set();

  constructor(connections: string[][]) {
    for (const [a, b] of connections) {
      const aNetwork = this._directConnections[a] || new Set<string>();
      const bNetwork = this._directConnections[b] || new Set<string>();
      aNetwork.add(b);
      bNetwork.add(a);
      this._directConnections[a] = aNetwork;
      this._directConnections[b] = bNetwork;
      if (a.startsWith("t")) this._tComputers.add(a);
      if (b.startsWith("t")) this._tComputers.add(b);
    }
  }

  public getConnectedThrees() {
    const result: Set<string> = new Set();
    for (const a in this._directConnections) {
      for (const b of this._directConnections[a]) {
        const inBoth = intersection(this._directConnections[a], this._directConnections[b]);
        if (inBoth.size > 0) {
          for (const c of inBoth) {
            if (intersection(this._tComputers, new Set([a, b, c])).size > 0) {
              const key = [a, b, c].sort().join(",");
              result.add(key);
            }
          }
        }
      }
    }
    return result;
  }
}

// Results
// console.log(input)
const network = new LocalNetwork(input);
// const a = network._directConnections["wq"];
// const b = network._directConnections["tb"];
// console.log(a, b, intersection(a, b));
// const c = network._directConnections[]
// console.log(intersection(network._directConnections["wq"], network._directConnections["vc"]))

console.log(network.getConnectedThrees().size);
