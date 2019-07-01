import * as fs from 'fs-promise';
import * as path from 'path';

async function getAllFiles(dir: string, fileList: Array<string>): Promise<Array<string>> {
  const files = await fs.readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      fileList = await getAllFiles(filePath, fileList);
    } else {
      fileList.push(file);
    }
  }

  return fileList;
}
export default getAllFiles;