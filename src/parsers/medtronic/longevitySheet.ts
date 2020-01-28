import * as XLSX from 'xlsx';
import { WorkSheet } from './worksheet';
import * as models from './../../models';

export class LongevitySheet extends WorkSheet {
  constructor(workSheet: XLSX.WorkSheet) {
    super(workSheet);
  }
  parse(): models.WorksheetRow {
    this.fixEmptyName('Pulse Width [ms]', '-->');
    this.fixEmptyName('Mean [months]', '--->');
    return super.parse();
  }
}