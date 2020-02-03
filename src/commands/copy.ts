import execute from './command';
import path from 'path';
import fs from 'fs';
import { includedFiles } from './filterFiles';

export async function copy(device: string) {
  return execute(device, async () => {
    const outputFolder = '/tmp/interrogations/source-files';
    try {
      if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, {recursive: true});
      }
      const filesInfo = await includedFiles(device, false);
      filesInfo.forEach(fileInfo => {
        fs.copyFileSync(fileInfo.filePath, path.join(outputFolder, fileInfo.fileName)); // one off, using sync method
      });
    }
    catch (err) {
      console.error(err);
    }

    console.log('Source files saved in:', outputFolder);
  });
}