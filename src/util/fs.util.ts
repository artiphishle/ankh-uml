import {lstatSync, readdirSync, readFileSync, writeFileSync} from 'fs';
import {join} from 'path';
import {EErrFs} from 'src/types/error.constants';

/**
 * @interface
 * @property {string} dir - The directory to search.
 * @property {string} term - The term to search for.
 * @property {string[]} result - The result of the search.
 */
export interface SearchOptions {
  dir: string;
  term: string;
  result?: string[];
}

/**
 * @function
 * @summary Check if a file or directory exists.
 * @param {string} fileOrDir - The file or directory to check.
 * @return {boolean} True if the file or directory exists, false otherwise.
 */
export function lsStatSync(fileOrDir: string) {
  try {
    return lstatSync(fileOrDir);
  } catch (error) {
    throw new Error(`${lsStatSync} ${error}`);
  }
}

/**
 * @function
 * @summary Read a directory synchronously.
 * @param {string} dir - The directory to read.
 * @return {string[]} The content of the directory.
 */
export function readDirSync(dir: string) {
  try {
    return readdirSync(dir);
  } catch (error) {
    throw new Error(`${readDirSync} ${error}`);
  }
}

/**
 * @function
 * @summary Read a file synchronously.
 * @param {string} file - The file to read.
 * @return {string} The content of the file.
 */
export function readSync(file: string) {
  try {
    return readFileSync(file, 'utf8');
  } catch (error) {
    throw new Error(`${EErrFs.ReadSync} ${error}`);
  }
}

/**
 * @function
 * @summary Search recursively for a file.
 * @return {string[]}
 */
export function search({dir, term, result = []}: SearchOptions) {
  readDirSync(dir).forEach((fileOrDir) => {
    const filePath = join(dir, fileOrDir);
    const {isDirectory} = lsStatSync(filePath);

    if (isDirectory()) return search({dir: filePath, term, result});
    if (fileOrDir.includes(term)) return result.push(filePath);
  });
  return result;
}

/**
 * @function
 * @summary Write a file synchronously.
 * @param {string} file - The file to write to.
 * @param {string} content - The content to write.
 * @return {void}
 */
export function writeSync(file: string, content: string) {
  try {
    return writeFileSync(file, content);
  } catch (error) {
    throw new Error(`${readSync} ${error}`);
  }
}
