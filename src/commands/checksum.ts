import execute from './command';
import { includedFiles } from './filterFiles';
import generateChecksum from './../util/checksum';
import * as interrogations from './../interrogations';

export async function checksum(device: string) {
  return execute(device, async () => {
    const filesInfo = await includedFiles(device, false);

    const filesChecksum = [];
    filesInfo.forEach(fileInfo => {
      const interrogation = new interrogations.StJude(fileInfo.filePath); // TODO: implement interrogations factory based on device
      const fieldsChecksum = [];
    });

  });
}