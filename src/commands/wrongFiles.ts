import path from 'path';
import execute from './command';
import { includedFiles } from './filterFiles';
import dumpToFile from '../util/dumpToFile';
import sanitizeFilePath from '../util/sanitiseFilePath';
import * as interrogations from '../interrogations';
import * as errors from '../errors';

export async function invalidFiles(device: string) {
  return execute(device, async () => {
    const filesInfo = await includedFiles(device, false);
    let currentFilePath = '';
    const wrongFiles = [];
    for (const fileInfo of filesInfo) {
      currentFilePath = fileInfo.filePath;
      try {
        const interrogation = new interrogations.StJude(fileInfo.filePath); // TODO: implement interrogations factory based on device, consider creating generic type instead of using StJudeData type
        await interrogation.getData();
      }
      catch (err) {
        if (err instanceof errors.NoContent) {
          wrongFiles.push(sanitizeFilePath(currentFilePath));
        }
      }
    }
    const outputPath = path.join(__dirname, '../../output', `wrong-${device.toLowerCase()}-files.yaml`);
    dumpToFile(outputPath, wrongFiles);
  });
}