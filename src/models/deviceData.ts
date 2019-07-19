import { ValueTypePair } from './valueTypePair';
export interface DeviceData {
  deviceId: string;
  columns: string[];
  rows: ValueTypePair[][];
}