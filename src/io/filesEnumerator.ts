import { promises as fs } from 'fs';
import * as path from 'path';
import FileInfo from './fileInfo';

async function getAllFiles(dir: string, filter: FileFilterCallback = undefined, results: FilesResult = { includedFiles: [], excludedFiles: []} ): Promise<FilesResult> {
  const files = await fs.readdir(dir);

  for (const fileName of files) {
    const filePath = path.join(dir, fileName);
    const stat = await fs.stat(filePath);
    const dateModified = stat.mtime;

    if (stat.isDirectory()) {
      results = await getAllFiles(filePath, filter, results);
    } else {
      const fileInfo = {fileName, filePath, dateModified};
      if (filter) {
        if (filter(fileInfo) === true) {
          results.includedFiles.push(fileInfo);
        }
        else {
          results.excludedFiles.push(fileInfo);
        }
      }
      else {
        results.includedFiles.push(fileInfo);
      }
    }
  }

  return results;
}
export default getAllFiles;

export interface FilesResult {
  includedFiles: Array<FileInfo>;
  excludedFiles: Array<FileInfo>;
}

export interface FileFilterCallback {
  (fileInfo: FileInfo): boolean;
}

