import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import { Exporter } from './exporter';

export class Excel extends Exporter  {
   constructor(folderPath: string, device: string) {
     super(folderPath, device);
   }

   async saveTo(outputFolder: string = '/tmp/interrogations') {
     const exportData = await this.getExportData();
     if (!fs.existsSync(outputFolder)) {
         fs.mkdirSync(outputFolder);
     }

     for (let i = 0; i < exportData.length; i++) {
       const deviceData = exportData[i];
       const workSheetName = deviceData.name;
       const data: Array<Array<any>> = [deviceData.columns];
       deviceData.rows.forEach(row => {
        data.push(row.map(field => field.value));
       });
       const workbook = xlsx.utils.book_new();
       const worksheet = xlsx.utils.aoa_to_sheet(data, {cellDates: true});
       xlsx.utils.book_append_sheet(workbook, worksheet, workSheetName);
       xlsx.writeFile(workbook, path.join(outputFolder, `${this.device}-${deviceData.deviceId}.xlsx`));
     }
   }
}