import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { union } from "@jakub-l/aoc-lib/collections";
import { prod } from "@jakub-l/aoc-lib/math";

// Input
const input: string[] = readFile(__dirname + "/input.txt");

// Part 1
/** A connection between two junction boxes */
class Connection {
  /** The source junction box */
  src: JunctionBox;
  /** The destination junction box */
  dest: JunctionBox;
  /** The distance between the two junction boxes */
  distance: number;

  /**
   * Creates a new connection between two junction boxes
   * @param src - The source junction box
   * @param dest - The destination junction box
   */
  constructor(src: JunctionBox, dest: JunctionBox) {
    this.src = src;
    this.dest = dest;
    this.distance = src.distance(dest);
  }

  /** The ID of the connection */
  get id(): string {
    return `${this.src.id} > ${this.dest.id}`;
  }
}

/** A junction box */
class JunctionBox {
  /** The x-coordinate of the junction box */
  x: number;
  /** The y-coordinate of the junction box */
  y: number;
  /** The z-coordinate of the junction box */
  z: number;

  /**
   * Creates a new junction box
   * @param rawInput - The raw input string in the format "x,y,z"
   */
  constructor(rawInput: string) {
    const [x, y, z] = rawInput.split(",").map(Number);
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Calculates the euclidean distance to another junction box
   * @param box - The other junction box
   * @returns The distance between the two junction boxes
   */
  public distance(box: JunctionBox) {
    return Math.sqrt(
      Math.pow(this.x - box.x, 2) + Math.pow(this.y - box.y, 2) + Math.pow(this.z - box.z, 2)
    );
  }

  /** The ID of the junction box */
  get id(): string {
    return `${this.x},${this.y},${this.z}`;
  }
}

/** A network of junction boxes */
class Network {
  /** The junction boxes in the network */
  junctionBoxes: JunctionBox[] = [];
  /** The connections between the junction boxes */
  edges: Connection[] = [];
  /** The circuits in the network */
  circuits: Record<string, Set<string>> = {};

  /**
   * Creates a new network of junction boxes
   * @param rawInput - The raw input strings in the format "x,y,z"
   */
  constructor(rawInput: string[]) {
    this.junctionBoxes = rawInput.map(line => new JunctionBox(line));
    for (let i = 0; i < this.junctionBoxes.length; i++) {
      for (let j = i + 1; j < this.junctionBoxes.length; j++) {
        this.edges.push(new Connection(this.junctionBoxes[i], this.junctionBoxes[j]));
      }
    }
  }

  /**
   * Connects the junction boxes in the network
   * @param maxSteps - The maximum number of connections to make
   * @returns The product of the x coordinates of the two junction boxes which were connected
   *          to form a single circuit
   */
  public connectBoxes(maxSteps: number = Number.MAX_SAFE_INTEGER) {
    const queue = this.edges.toSorted((a, b) => a.distance - b.distance).slice(0, maxSteps);
    const boxToCircuit: Record<JunctionBox["id"], number> = {};
    let nextCircuit = 0;
    this.circuits = {};

    for (const edge of queue) {
      const { src, dest } = edge;

      if (!(dest.id in boxToCircuit) && !(src.id in boxToCircuit)) {
        // Neither box has a circuit - create a new circuit
        boxToCircuit[dest.id] = nextCircuit;
        boxToCircuit[src.id] = nextCircuit;
        this.circuits[nextCircuit.toString()] = new Set([dest.id, src.id]);
        nextCircuit++;
      } else if (dest.id in boxToCircuit && src.id in boxToCircuit) {
        // Both boxes have a circuit - merge two together.

        // If the two boxes are already in the same circuit, do nothing.
        if (boxToCircuit[dest.id] === boxToCircuit[src.id]) continue;

        // Merge the source circuit into the destination circuit.
        const destCircuitId = boxToCircuit[dest.id];
        const srcCircuitId = boxToCircuit[src.id];
        for (const id of this.circuits[srcCircuitId]) boxToCircuit[id] = destCircuitId;
        this.circuits[destCircuitId] = union(
          this.circuits[destCircuitId],
          this.circuits[srcCircuitId]
        );
        delete this.circuits[srcCircuitId];
      } else if (dest.id in boxToCircuit) {
        // Destination has a circuit - add source to it
        const destCircuitId = boxToCircuit[dest.id];
        boxToCircuit[src.id] = destCircuitId;
        this.circuits[destCircuitId].add(src.id);
      } else {
        // Source has a circuit - add destination to it
        const srcCircuitId = boxToCircuit[src.id];
        boxToCircuit[dest.id] = srcCircuitId;
        this.circuits[srcCircuitId].add(dest.id);
      }

      // If there is only one circuit with all the nodes in it, we can
      // terminate early.
      const srcCircuitId = boxToCircuit[src.id];
      if (this.circuits[srcCircuitId].size === this.junctionBoxes.length) {
        return src.x * dest.x;
      }
    }
  }

  /**
   * Finds the sizes of the n largest circuits
   * @param n - The number of largest circuits to find
   * @returns The sizes of the n largest circuits
   */
  public largestCircuits(n: number) {
    return Object.values(this.circuits)
      .map(circuit => circuit.size)
      .sort((a, b) => b - a)
      .slice(0, n);
  }
}

// Results
const network = new Network(input);
network.connectBoxes(1000);
console.log(`Part 1: ${prod(network.largestCircuits(3))}`);
console.log(`Part 1: ${network.connectBoxes()}`);
