import { includedFiles } from './../commands/filterFiles';
import { DeviceRows } from './../models/deviceRows';
import { WorksheetData } from './../models/worksheetData';
import { InterrogationFactory } from './../interrogations';
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
        const interrogation = InterrogationFactory.getInterrogation(this.device, fileInfo.filePath);
        const data = await interrogation.getData();

        const deviceId = data.getDeviceId();
        const findIndex = devicesRows.findIndex(fg => fg.deviceId == deviceId);
        const deviceRow = data.getWorksheetRow();
        const extraRows = data.getExtraWorksheetRows(0);
        // two extra fields at the beginning
        // const fileDateModifiedField = {id: -1000, name: 'File Date Modified', type: 'string', firstValue: interrogation.dateModified};
        // const filePathField = {id: -500, name: 'File Path', type: 'string', firstValue: interrogation.sanitizeFilePath};
        // deviceRow.unshift(fileDateModifiedField, filePathField);
        if (findIndex != -1) {
          devicesRows[findIndex].rows.push(deviceRow);
        }
        else {
          devicesRows.push({deviceId, rows: [deviceRow], extraRows: extraRows});
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

  protected async getExportData(): Promise<WorksheetData[][]> {
    const workBookData: WorksheetData[][] = [];
    const devicesRows = await this.getRowsForDevices();
    const dataProvider = new interrogations.WorksheetsDataProvider();
    for (let i = 0; i < devicesRows.length; i++) {
        const workbookRows = devicesRows[i];
        const worksheetData1 = dataProvider.getWorksheetData('interrogations', workbookRows.deviceId, workbookRows.rows);
        const worksheetsData: WorksheetData[] = [worksheetData1];
        if (workbookRows.extraRows.length > 0) {
          const worksheetData2 = dataProvider.getWorksheetData('episodes', workbookRows.deviceId, workbookRows.extraRows);
          worksheetsData.push(worksheetData2);
        }

        if (workBookData.indexOf(worksheetsData) === -1) {
          workBookData.push(worksheetsData);
        }

    }
    return workBookData;
  }
}