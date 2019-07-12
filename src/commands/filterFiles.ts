import path from 'path';
import yaml from 'js-yaml';
import { homedir } from 'os';
import { promises as fs } from 'fs';
import { FilesResult } from './../io/fileEnumerator';
import FileInfo from './../io/fileInfo';
import * as constants from './../util/constants';
import { isStJudeLogFile } from './../io/fileFilters';
import getAllFiles from './../io/fileEnumerator';

import execute from './command';

function filterStJudeFiles(device: string, description: string, selector: (result: FilesResult) => Array<FileInfo>) {
  execute(device, async normalizedDevice => {
    console.log(`Generating ${description} file list for`, normalizedDevice);
    if (normalizedDevice === constants.STJUDE) {
      const folderPath = path.join(homedir(), 'Desktop', 'Interrogacje');
      console.log('Getting files from:', folderPath);
      const result = await getAllFiles(folderPath, isStJudeLogFile);
      const filesInfo = selector(result).filter(f => f.file.endsWith('.log')).map(f => {
        return {
          filePath: f.filePath.replace(path.join(homedir(), 'Desktop'), ''),
          dateModified: f.dateModified
        };
      });
      const outputPath = path.join(__dirname, '../../output', `${description}.yaml`);
      await fs.writeFile(outputPath, yaml.dump(filesInfo));
      console.log('Files saved in:', outputPath);
    }
  });
}

export function excludedFiles(device: string) {
  filterStJudeFiles(device, 'excluded', result => result.excludedFiles);
}

export function includedFiles(device: string) {
  filterStJudeFiles(device, 'included', result => result.includedFiles);
}