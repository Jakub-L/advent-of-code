import { Counter } from "@jakub-l/aoc-lib/collections";
import { prod } from "@jakub-l/aoc-lib/math";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// UTILS
/** A bi-directional graph edge */
class Edge {
  constructor(public src: string, public dest: string) {}
}

/** An undirected graph */
class Graph {
  /** Set of vertices */
  public V: Set<string> = new Set();
  /** List of edges */
  public E: Edge[] = [];

  /**
   * Creates a graph from an input
   * @param {string[][]} input - Input to the graph in the form ['src', 'dest1 dest2 dest3'][]
   */
  constructor(input: string[][]) {
    for (const [src, destString] of input) {
      this.V.add(src);
      for (const dest of destString.split(" ")) {
        this.V.add(dest);
        this.E.push(new Edge(src, dest));
      }
    }
  }

  /**
   * Uses Karger's algorithm to find the minimum cut of the graph
   *
   * The algorithm works by randomly choosing an edge and merging the two vertices. This means
   * that for any edge {u, v} the merge creates a vertex uv and any edges {u, w} and {v, w} are
   * now {uv, w} (assuming w is neither u nor v).
   *
   * The alrgorithm uses an element of randomness, which means we need to repeat it until we find
   * the cut we're interested in (one that cuts 3 edges).
   *
   * @returns {number} The product of the sizes of the two groups that the graph was cut into
   */
  minCut(): number {
    while (true) {
      const vertices = Array.from(this.V);
      let vertexCount = vertices.length;
      // Array of vertex groups. For example, groups[0] is the group that vertex 0
      // belongs to. The array is initialised so that each vertex is in its own
      // parent (it is in its own group).
      const groups: number[] = Array.from(this.V).map((_, i) => i);

      while (vertexCount > 2) {
        const randomEdge = this.E[Math.floor(Math.random() * this.E.length)];
        const srcGroup = this._find(groups, vertices.indexOf(randomEdge.src));
        const destGroup = this._find(groups, vertices.indexOf(randomEdge.dest));

        // If the edge connects two different groups, we compress the edge.  
        if (srcGroup !== destGroup) {
          this._union(groups, srcGroup, destGroup);
          vertexCount--;
        }
      }

      // Once we have reduced the graph to two vertices, we count the number of edges
      // we had to cut. We check every edge and see if its source and destination
      // are in different groups. If they are, then we have cut that edge.
      let cutedges = 0;
      for (const edge of this.E) {
        const srcGroup = this._find(groups, vertices.indexOf(edge.src));
        const destGroup = this._find(groups, vertices.indexOf(edge.dest));
        if (srcGroup !== destGroup) cutedges++;
        // We're only interested in cuts that cut 3 edges, so if we already went over, we
        // can stop early.
        if (cutedges > 3) break;
      }
      if (cutedges === 3) return prod(Array.from(new Counter(groups).values()));
    }
  }

  /**
   * Finds the group to which i-th vertex belongs
   *
   * If the vertex is its own parent, then we have found the root of the group.
   * Otherwise, we go one up the path (we look at the parent) and we repeat.
   *
   * This function also performs path compression, which means that after we find
   * the root of the group, we set the parent of all vertices on the path to be
   * the root of the group.
   *
   * @param {number[]} groups - Array of vertex groups
   * @param {number} i - Index of the vertex
   * @returns {number} The index of the root of the group to which the vertex belongs
   */
  _find(groups: number[], i: number): number {
    if (groups[i] !== i) groups[i] = this._find(groups, groups[i]);
    return groups[i];
  }

  /**
   * Combines two groups into one.
   *
   * We find the two roots of i-th and j-th vertices. We set the root of the group
   * i belongs to to be the root of the group j belongs to.
   * @param {number[]} groups - Array of vertex groups
   * @param {number} i - Index of the first vertex
   * @param {number} j - Index of the second vertex
   */
  _union(groups: number[], i: number, j: number): void {
    const iRoot = this._find(groups, i);
    const jRoot = this._find(groups, j);
    groups[iRoot] = jRoot;
  }
}

// INPUT PROCESSING
const input = readFile(__dirname + "/input.txt", ["\n", ": "]) as string[][];
const graph = new Graph(input);

// RESULTS
console.log(`Part 1: ${graph.minCut()}`);
