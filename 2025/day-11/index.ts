import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// Input
const input: string[] = readFile(__dirname + "/input.txt");

// Part 1 & 2
/** A rack of connected devices */
class ServerRack {
  /** A map of device names to their connections, directional */
  devices: Record<string, string[]> = {};

  /**
   * Creates a new server rack
   * @param deviceStrings - An array of strings, each representing a device and its connections
   */
  constructor(deviceStrings: string[]) {
    for (const str of deviceStrings) {
      const [name, ...connections] = str.split(/:*\s/);
      this.devices[name] = connections;
    }
    this.devices["out"] = [];
  }

  /**
   * Counts the number of paths from start to end via all required nodes.
   * If `required` is empty, then all paths from start to finish are counted.
   *
   * @param options - Options for path traversal
   * @param options.start - Starting node name
   * @param options.end - Target node name
   * @param options.required - Array of nodes that must be passed when traversing from start to end
   * @returns
   */
  public countPathsVia({
    start,
    end,
    required = []
  }: {
    start: string;
    end: string;
    required?: string[];
  }) {
    if (!(start in this.devices) || !(end in this.devices)) return 0;

    const requiredSet = new Set(required);
    const allRequiredNodesVisited: Record<string, boolean> = required.reduce(
      (acc, node) => ({ ...acc, [node]: false }),
      {}
    );
    const pathsMemo: Record<string, number> = {};
    const visited = new Set<string>();

    const search = (node: string, requiredNodesVisited: Record<string, boolean>): number => {
      const newNodesVisited = requiredSet.has(node)
        ? { ...requiredNodesVisited, [node]: true }
        : requiredNodesVisited;
      const key = `${node}-${JSON.stringify(newNodesVisited)}`;
      let count = 0;

      if (node === end) return Object.values(newNodesVisited).every(v => v) ? 1 : 0;
      if (key in pathsMemo) return pathsMemo[key];
      if (visited.has(key)) return 0;

      visited.add(key);
      for (const connection of this.devices[node] ?? []) {
        count += search(connection, newNodesVisited);
      }
      visited.delete(key);
      pathsMemo[key] = count;

      return count;
    };

    return search(start, allRequiredNodesVisited);
  }
}

// Results
const rack = new ServerRack(input);
console.log(`Part 1: ${rack.countPathsVia({ start: "you", end: "out" })}`);
console.log(
  `Part 2: ${rack.countPathsVia({ start: "svr", end: "out", required: ["fft", "dac"] })}`
);
