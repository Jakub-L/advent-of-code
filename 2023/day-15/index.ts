import { readFile } from "@jakub-l/aoc-lib/input-parsing";
import { DoublyLinkedList } from "@jakub-l/aoc-lib/data-structures";
import { sum } from "@jakub-l/aoc-lib/math";

// UTILS
type Lens = { label: string; focalLength: number };

/**
 * Hashes a string.
 *
 * The hash starts at 0. For each character, the hash is:
 *    - Incremented by the character's ASCII
 *    - Multiplied by 17
 *    - Modulo 256
 * The final hash is the result of the last iteration.
 * @param {string} str - The string to hash
 * @returns {number} The hash of the string
 */
const hash = (str: string): number => str.split("").reduce((acc, c) => (17 * (acc + c.charCodeAt(0))) % 256, 0);

/** A class representing a lens configuration  */
class LensConfiguration {
  /** Boxes containing lenses */
  private _boxes: DoublyLinkedList<Lens>[] = Array.from({ length: 256 }, () => new DoublyLinkedList());

  /**
   * Processes a single instruction.
   *
   * The first characters of the lens are their label and the hash of the label is the
   * box to be interacted with. The rest of the instruction can be either a minus sign
   * or an equals sign followed by a number.
   *    - If it's a minus sign, the lens with the given label is removed from the box.
   *    - If it's an equals sign, the lens with the given label is added to the box
   *      with the given focal length. If the lens already exists, its focal length
   *      is updated.
   * @param {string} instruction - The instruction to process
   */
  processInstruction(instruction: string) {
    const [_, label, operation] = instruction.match(/([a-z]+)(-|(=\d+))/)!;
    const box = hash(label);
    if (operation === "-") {
      this._boxes[box].removeBy(lens => lens.label === label);
    } else {
      const focalLength = parseInt(operation.slice(1));
      const existingLens = this._boxes[box].findBy(lens => lens.label === label);
      if (existingLens) existingLens.focalLength = focalLength;
      else this._boxes[box].add({ label, focalLength });
    }
  }

  /** 
   * The total focusing power of the configuration. This is defined
   * as the sum of the focusing powers of each lens, which in turn is
   * the product of the box index (1-indexed), the lens index (1-indexed)
   * and the focal length of the lens.
   * @returns {number} The total focusing power of the configuration
   */
  get focusingPower(): number {
    let sum = 0;
    for (let i = 0; i < this._boxes.length; i++) {
      let j = 1;
      for (let lens of this._boxes[i].forward()) {
        sum += (i + 1) * j * lens.focalLength;
        j++;
      }
    }
    return sum;
  }
}

// INPUT PROCESSING
const input = readFile(__dirname + "/input.txt", [","]) as string[];
const map = new LensConfiguration();
for (let instruction of input) map.processInstruction(instruction);

// RESULTS
console.log(`Part 1: ${sum(input.map(hash))}`);
console.log(`Part 2: ${map.focusingPower}`);
