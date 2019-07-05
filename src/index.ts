import { Command } from 'commander';
import getAllFiles from './io/fileEnumerator';
import { isStJudeLogFile } from './io/fileFilters';
import FileInfo from './io/fileInfo';
import { FilesResult } from './io/fileEnumerator';
import { homedir } from 'os';
import path from 'path';
import { promises as fs } from 'fs';
import yaml from 'js-yaml';

const STJUDE = 'stjude',
      BIOTRONIK = 'biotronik',
      MEDTRONIK = 'medtronik';
const command = new Command();
command
  .version('0.0.1')
  .description('CLI for converting heart valves output data into Excel format')
  .option('-c, --checksum <device>', 'generates checksums of all log files for specific device type e.g.: StJude, Biotronik or Medtronik', checksum)
  .option('-e, --excluded <device>', 'generates list of excluded log files for specific device type e.g.: StJude, Biotronik or Medtronik', excluded)
  .option('-i, --included <device>', 'generates list of included log files for specific device type e.g.: StJude, Biotronik or Medtronik', included)
  .parse(process.argv);


function executeCommand(device: string, callback: (device: string) => void)  {
  const supportedDevices = [STJUDE, BIOTRONIK, MEDTRONIK];
  const normalizedDevice = device.toLowerCase();
  if (device && supportedDevices.indexOf(normalizedDevice) === -1) {
    console.error(`The "${device}" is not supported type, please use StJude, Biotronik or Medtronik.`);
    return;
  }

  callback(normalizedDevice);
}
function checksum(device: string) {
  executeCommand(device, normalizedDevice => {
    console.log('Generating checksums for', normalizedDevice);
  });
}

function filterStJudeFiles(device: string, description: string, selector: (result: FilesResult) => Array<FileInfo>) {
  executeCommand(device, async normalizedDevice => {
    console.log(`Generating ${description} file list for`, normalizedDevice);
    if (normalizedDevice === STJUDE) {
      const folderPath = path.join(homedir(), 'Desktop', 'Interrogacje');
      console.log('Getting files from:', folderPath);
      const result = await getAllFiles(folderPath, isStJudeLogFile);
      const filePaths = selector(result).filter(f => f.file.endsWith('.log')).map(f => {
        return f.filePath.replace(path.join(homedir(), 'Desktop'), '');
      });
      const outputPath = path.join(__dirname, '../output', `${description}.yaml`);
      await fs.writeFile(outputPath, yaml.dump(filePaths));
      console.log('Files saved in:', outputPath);
    }
  });
}
function excluded(device: string) {
  filterStJudeFiles(device, 'excluded', result => result.excludedFiles);
}

function included(device: string) {
  filterStJudeFiles(device, 'included', result => result.includedFiles);
}