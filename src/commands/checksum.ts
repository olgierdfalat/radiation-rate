import path from 'path';
import execute from './command';
import { includedFiles } from './filterFiles';
import dumpToFile from './../util/dumpToFile';
import sanitizeFilePath from './../util/sanitiseFilePath';
import * as interrogations from './../interrogations';
import * as errors from './../errors';

export async function checksum(device: string) {
  return execute(device, async () => {
    const filesInfo = await includedFiles(device, false);

    const devicesChecksums: any = {};
    let currentFilePath = '';
    for (const fileInfo of filesInfo) {
      currentFilePath = fileInfo.filePath;
      try {
        const interrogation = new interrogations.StJude(fileInfo.filePath); // TODO: implement interrogations factory based on device, consider creating generic type instead of using StJudeData type
        const data = await interrogation.getData();
        const deviceId = data.getDeviceId().toString();
        const idsChecksum = data.getIdsChecksum();
        // const contentChecksum = data.getChecksum();
        if (!devicesChecksums[deviceId]) {
          devicesChecksums[deviceId] = [];
        }
        let checksumItem = devicesChecksums[deviceId].find((c: any) => c.idsChecksum === idsChecksum);
        if (!checksumItem) {
          checksumItem = {idsChecksum, files: []};
          devicesChecksums[deviceId].push(checksumItem);
        }
        checksumItem.files.push(sanitizeFilePath(fileInfo.filePath));
      }
      catch (err) {
        if (err instanceof errors.NoContent) {
          console.warn(`No content found for:`, currentFilePath);
        }
        else {
         console.error('Exception occurred durning checksum generation for:', fileInfo, ', error details:', err);
        }
      }
    }
    const outputPath = path.join(__dirname, '../../output', `${device.toLowerCase()}-checksums.yaml`);
    dumpToFile(outputPath, devicesChecksums);
  });
}