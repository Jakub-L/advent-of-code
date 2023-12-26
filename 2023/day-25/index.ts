import { Counter } from "@jakub-l/aoc-lib/collections";
import { prod } from "@jakub-l/aoc-lib/math";
import { readFile } from "@jakub-l/aoc-lib/input-parsing";


const input = readFile(__dirname + "/input.txt", ["\n", ": "]) as string[][];

class Edge {
  constructor(public src: string, public dest: string) {}
}

class Graph {
  public V: Set<string> = new Set();
  public E: Edge[] = [];

  constructor(input: string[][]) {
    for (const [src, destString] of input) {
      this.V.add(src);
      for (const dest of destString.split(" ")) {
        this.V.add(dest);
        this.E.push(new Edge(src, dest));
      }
    }
  }

  minCut() {
    let attempts = 0;
    while (true) {
      attempts++;
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

        if (srcGroup !== destGroup) {
          this._union(groups, srcGroup, destGroup);
          vertexCount--;
        }
      }

      let cutedges = 0;
      for (const edge of this.E) {
        const srcGroup = this._find(groups, vertices.indexOf(edge.src));
        const destGroup = this._find(groups, vertices.indexOf(edge.dest));
        if (srcGroup !== destGroup) cutedges++;
      }
      if (cutedges === 3) {
        return prod(Array.from(new Counter(groups).values()));
      }
    }
  }

  /**
   * Finds the group to which i-th vertex belongs
   *
   * If the vertex is its own parent, then we have found the root of the group.
   * Otherwise, we go one up the path (we look at the parent) and we repeat.
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

const graph = new Graph(input);
console.log(graph.minCut());
