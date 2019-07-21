import ExportData from './exportData';


export interface DeviceDataProvider {
  getData(folderPath: string): ExportData;
}