import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import { Exporter } from './exporter';

export class Excel extends Exporter {
  constructor(folderPath: string, device: string) {
    super(folderPath, device);
  }

  async saveTo(outputFolder: string = '/tmp/interrogations') {
    const exportData = await this.getExportData();
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder);
    }
    for (let i = 0; i < exportData.length; i++) {
      const worksheetsData = exportData[i];
      const workbook = xlsx.utils.book_new();
      let deviceId = 'unknown-device-id';
      for (let j = 0; j < worksheetsData.length; j++) {
        const worksheetData = exportData[i][j];
        const worksheetName = worksheetData.name;
        deviceId = worksheetData.deviceId;

        const data: Array<Array<any>> = [worksheetData.columns];
        worksheetData.rows.forEach(row => {
          data.push(row.map(field => field.value));
        });
        const worksheet = xlsx.utils.aoa_to_sheet(data, { cellDates: true });
        xlsx.utils.book_append_sheet(workbook, worksheet, worksheetName);
      }
      console.log(`${i + 1}. Exporting device[${deviceId}] data to Excel.`);
      xlsx.writeFile(workbook, path.join(outputFolder, `${this.device}-${deviceId}.xlsx`));
    }
  }
}