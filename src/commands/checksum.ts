import execute from './command';
import { includedFiles } from './filterFiles';

export function checksum(device: string) {
  execute(device, normalizedDevice => {
    const filesInfo = includedFiles(device, false);
  });
}