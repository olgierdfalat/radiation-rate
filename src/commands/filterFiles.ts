import path from 'path';
import { homedir } from 'os';
import { FilesResult } from './../io/fileEnumerator';
import FileInfo from './../io/fileInfo';
import * as constants from './../util/constants';
import { isStJudeLogFile } from './../io/fileFilters';
import getAllFiles from './../io/fileEnumerator';
import dumpToFile from './../util/dumpToFile';
import execute from './command';

async function dumpFiles(device: string, description: string, filesInfo: Array<FileInfo>) {
  console.log(`Generating ${description} file list for`, device);
  const outputPath = path.join(__dirname, '../../output', `${description}.yaml`);
  await dumpToFile(outputPath, filesInfo);
  console.log('Files saved in:', outputPath);
}

async function filterDeviceFiles(device: string, selector: (result: FilesResult) => Array<FileInfo>): Promise<Array<FileInfo>> {
  return execute(device, async normalizedDevice => {
    const folderPath = path.join(homedir(), 'Desktop', 'Interrogacje');
    console.log('Getting files from:', folderPath);

    if (normalizedDevice === constants.STJUDE) {
      const result = await getAllFiles(folderPath, isStJudeLogFile);
      return selector(result).filter(f => f.file.endsWith('.log'));
    }
    throw new Error(`Unknown device[${normalizedDevice}]`);
  });
}

async function filterFiles(device: string, description: string, dump: boolean, selector: (result: FilesResult) => Array<FileInfo>): Promise<Array<FileInfo>> {
  const filesInfo = await filterDeviceFiles(device, selector);
  if (dump) {
    dumpFiles(device, description, filesInfo.map(f => {
      return {
        file: f.file,
        filePath: f.filePath.replace(path.join(homedir(), 'Desktop'), ''),
        dateModified: f.dateModified
      };
    }));
  }
  return filesInfo;
}
export async function excludedFiles(device: string, dump: boolean = true): Promise<Array<FileInfo>> {
  return filterFiles(device, 'excluded', dump, result => result.excludedFiles);
}

export async function includedFiles(device: string, dump: boolean = true): Promise<Array<FileInfo>> {
  return filterFiles(device, 'included', dump, result => result.includedFiles);
}