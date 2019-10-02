import { ExcelWorksheetData } from './excelWorksheetData';

export interface DeviceDataProvider {
  getData(folderPath: string): ExcelWorksheetData;
}