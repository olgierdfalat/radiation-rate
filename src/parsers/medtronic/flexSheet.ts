import * as XLSX from 'xlsx';
import { WorkSheet } from './worksheet';

export class FlexSheet extends WorkSheet {
  constructor(workSheet: XLSX.WorkSheet) {
    super(workSheet);
  }
}