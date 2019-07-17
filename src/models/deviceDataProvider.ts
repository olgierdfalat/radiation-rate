import { DeviceData } from './deviceData';

export interface DeviceDataProvider {
  getData(folderPath: string): DeviceData
}