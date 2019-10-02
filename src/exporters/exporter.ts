import { includedFiles } from './../commands/filterFiles';
import { DeviceRows } from '../models/deviceRows';
import { WorksheetData } from '../models/worksheetData';
import * as interrogations from './../interrogations';
import * as errors from './../errors';

export class Exporter {
  private folderPath: string;
  protected device: string;
  constructor(folderPath: string, device: string) {
    this.folderPath = folderPath;
    this.device = device;
  }

  protected async getRowsForDevices(): Promise<DeviceRows[]> {
    const files = await includedFiles(this.device, false);
    const devicesRows: DeviceRows[] = [];
    for (let i = 0; i < files.length; i++) {
      const fileInfo = files[i];
      try {
        const interrogation = new interrogations.StJude(fileInfo.filePath); // TODO: resolve dynamically
        const data = await interrogation.getData();

        const deviceId = data.getDeviceId();
        const findIndex = devicesRows.findIndex(fg => fg.deviceId == deviceId);
        const deviceRow = data.getRow();
        // two extra fields at the beginning
        // const fileDateModifiedField = {id: -1000, name: 'File Date Modified', type: 'string', firstValue: interrogation.dateModified};
        // const filePathField = {id: -500, name: 'File Path', type: 'string', firstValue: interrogation.sanitizeFilePath};
        // deviceRow.unshift(fileDateModifiedField, filePathField);
        if (findIndex != -1) {
          devicesRows[findIndex].rows.push(deviceRow);
        }
        else {
          devicesRows.push({deviceId, rows: [deviceRow]});
        }
      }
      catch (err) {
        if (err instanceof errors.NoContent) {
          console.warn(`No content found for:`, fileInfo.filePath);
        }
        else {
         console.error('Exception occurred durning checksum generation for:', fileInfo, ', error details:', err);
        }
      }
    }

    return devicesRows;
  }

  protected async getExportData(): Promise<WorksheetData[]> {
    const result: WorksheetData[] = [];
    const devicesRows = await this.getRowsForDevices();
    const dataProvider = new interrogations.ExportDataProvider();
    for (let i = 0; i < devicesRows.length; i++) {
      const deviceRows = devicesRows[i];
      const exportData = dataProvider.getExportData(deviceRows.deviceId, deviceRows.rows);
      result.push(exportData);
    }
    return result;
  }
}