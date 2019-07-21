import execute from './command';
import path from 'path';
import { homedir } from 'os';
import * as exporters from './../exporters';

export async function exportToExcel(device: string) {
  return execute(device, async () => {
    const outputFolder = '/tmp/interrogations';
    const folderPath = path.join(homedir(), 'Desktop', 'Interrogacje');

    console.log(`Exporting to Excel files into ${outputFolder}`);
    const excelExporter = new exporters.Excel(folderPath, device);
    await excelExporter.saveTo(outputFolder);
    console.log('Export to excel has finished.');
  });
}