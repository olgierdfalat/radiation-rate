import { includedFiles } from './../commands/filterFiles';
import {DeviceRows} from '../models/deviceRows';
import {ExportData} from '../models/exportData';
import * as interrogations from './../interrogations';


export class Exporter {
  private folderPath: string;
  private device: string;
  constructor(folderPath: string, device: string) {
    this.folderPath = folderPath;
    this.device = device;
  }

  protected async getRowsForDevices(): Promise<DeviceRows[]> {
    const files = await includedFiles(this.device, false);
    const devicesRows: DeviceRows[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const interrogation = new interrogations.StJude(file.filePath); // TODO: resolve dynamically
      const data = await interrogation.getData();
      const deviceId = data.getDeviceId();
      const findIndex = devicesRows.findIndex(fg => fg.deviceId == deviceId);
      if (findIndex != -1) {
        devicesRows[findIndex].rows.push(data.getRow());
      }
      else {
        devicesRows.push({deviceId, rows: [data.getRow()]});
      }
    }

    return devicesRows;
  }

  protected async getExportData(): Promise<ExportData[]> {
    const result: ExportData[] = [];
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