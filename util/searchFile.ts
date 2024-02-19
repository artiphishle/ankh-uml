import { lstatSync, readdirSync } from "fs";
import { join } from "path";

export function searchFile(dir, term, result = []) {
  try {
    const files = readdirSync(dir);

    files.forEach((file) => {
      const filePath = join(dir, file);
      const stat = lstatSync(filePath);

      if (stat.isDirectory()) searchFile(filePath, term, result);
      else if (file.includes(term)) result.push(filePath);
    });
    return result;
  } catch (error) {
    throw new Error(error);
  }
}
