import { ValueTypePair } from './valueTypePair';
export interface WorksheetData {
  name: string;
  deviceId: string;
  columns: string[];
  rows: ValueTypePair[][];
}