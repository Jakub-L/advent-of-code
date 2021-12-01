import { readFileSync } from 'fs';

/**
 * Processes an input file into an array of strings
 * @param {string} path - Filepath of the input file to process
 * @param {string} [delimiter=\n] - Delimiter used to split file into array
 * @returns {Array.<string>} Input file split by delimiter
 */
export const readInput = (path: string, delimiter = '\n'): Array<string> => {
  return readFileSync(path, 'utf-8').split(delimiter);
};
