import { WorksheetData } from './worksheetData';

export interface DeviceDataProvider {
  getData(folderPath: string): WorksheetData;
}