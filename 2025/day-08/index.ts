import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { union } from "@jakub-l/aoc-lib/collections";
import { prod } from "@jakub-l/aoc-lib/math";

// Input
const input: string[] = readFile(__dirname + "/input.txt");
const testInput: string[] = `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`.split("\n");

// Part 1
class Edge {
  src: JunctionBox;
  dest: JunctionBox;
  distance: number;

  constructor(src: JunctionBox, dest: JunctionBox) {
    this.src = src;
    this.dest = dest;
    this.distance = src.distance(dest);
  }

  get id(): string {
    return `${this.src.id} > ${this.dest.id}`;
  }
}

class JunctionBox {
  x: number;
  y: number;
  z: number;

  constructor(rawInput: string) {
    const [x, y, z] = rawInput.split(",").map(Number);
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public distance(box: JunctionBox) {
    return Math.sqrt(
      Math.pow(this.x - box.x, 2) + Math.pow(this.y - box.y, 2) + Math.pow(this.z - box.z, 2)
    );
  }

  get id(): string {
    return `${this.x},${this.y},${this.z}`;
  }
}

class Network {
  junctionBoxes: JunctionBox[] = [];
  edges: Edge[] = [];
  circuits: Record<string, Set<string>> = {};

  constructor(rawInput: string[]) {
    this.junctionBoxes = rawInput.map(line => new JunctionBox(line));
    for (let i = 0; i < this.junctionBoxes.length; i++) {
      for (let j = i + 1; j < this.junctionBoxes.length; j++) {
        this.edges.push(new Edge(this.junctionBoxes[i], this.junctionBoxes[j]));
      }
    }
  }

  public connectBoxes(maxSteps: number) {
    const queue = this.edges.toSorted((a, b) => a.distance - b.distance).slice(0, maxSteps);
    const boxCircuits: Record<JunctionBox["id"], number> = {};
    let nextCircuit = 0;
    this.circuits = {};

    for (const edge of queue) {
      const { src, dest } = edge;
      if (!(dest.id in boxCircuits) && !(src.id in boxCircuits)) {
        // Neither box has a circuit - create a new circuit
        boxCircuits[dest.id] = nextCircuit;
        boxCircuits[src.id] = nextCircuit;
        this.circuits[nextCircuit.toString()] = new Set([dest.id, src.id]);
        nextCircuit++;
      } else if (dest.id in boxCircuits && src.id in boxCircuits) {
        // Both boxes have a circuit - merge two together
        if (boxCircuits[dest.id] === boxCircuits[src.id]) continue;
        const destCircuitId = boxCircuits[dest.id];
        const srcCircuitId = boxCircuits[src.id];
        for (const id of this.circuits[srcCircuitId]) {
          boxCircuits[id] = destCircuitId;
        }
        this.circuits[destCircuitId] = union(
          this.circuits[destCircuitId],
          this.circuits[srcCircuitId]
        );
        delete this.circuits[srcCircuitId];
      } else if (dest.id in boxCircuits) {
        // Destination has a circuit - add source to it
        const destCircuitId = boxCircuits[dest.id];
        boxCircuits[src.id] = destCircuitId;
        this.circuits[destCircuitId].add(src.id);
      } else {
        // Source has a circuit - add destination to it
        const srcCircuitId = boxCircuits[src.id];
        boxCircuits[dest.id] = srcCircuitId;
        this.circuits[srcCircuitId].add(dest.id);
      }
    }
  }

  public largestCircuits(n: number) {
    return Object.values(this.circuits)
      .map(circuit => circuit.size)
      .sort((a, b) => b - a)
      .slice(0, n);
  }
}

const network = new Network(input);
network.connectBoxes(1000);
console.log(prod(network.largestCircuits(3)));
