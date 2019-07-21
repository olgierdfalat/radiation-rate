import { ValueTypePair } from './valueTypePair';
export interface ExportData {
  deviceId: string;
  columns: string[];
  rows: ValueTypePair[][];
}