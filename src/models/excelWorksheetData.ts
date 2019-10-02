import { ValueTypePair } from './valueTypePair';
export interface ExcelWorksheetData {
  name: string;
  deviceId: string;
  columns: string[];
  rows: ValueTypePair[][];
}