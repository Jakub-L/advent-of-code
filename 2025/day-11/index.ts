import { readFile } from "@jakub-l/aoc-lib/input-parsing";

// Constants
const START = "you";
const END = "out";

// Input
const input: string[] = readFile(__dirname + "/input.txt");
const testInput = `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`.split("\n");

// Part 1
class ServerRack {
  devices: Record<string, string[]> = {};

  constructor(deviceStrings: string[]) {
    for (const str of deviceStrings) {
      const [name, ...connections] = str.split(/:*\s/);
      this.devices[name] = connections;
    }
  }

  public countPaths() {
    const queue = [START];
    let paths = 0;

    while (queue.length > 0) {
      const deviceName = queue.shift()!;
      for (const connection of this.devices[deviceName]) {
        if (connection === END) paths++;
        else queue.push(connection);
      }
    }
    return paths;
  }
}

const rack = new ServerRack(input);
console.log(rack.countPaths());
