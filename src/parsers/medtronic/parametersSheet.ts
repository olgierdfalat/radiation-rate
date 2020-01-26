import * as XLSX from 'xlsx';
import { WorkSheet } from './worksheet';
import * as models from './../../models';

export class ParametersSheet extends WorkSheet {
  constructor(workSheet: XLSX.WorkSheet) {
    super(workSheet);
  }

  parse(): models.WorksheetRow {
    for(let i = 0; i < this.worksheetRows.length; i++) {
      const row = this.worksheetRows[i];
      if(row && row.length > 0) {
        const name = row[0];
        if(name) {
          this.row.push({name: name.trim(), type: 'string', value: row.splice(1).join(', ')});
        }
      }
    }
    return this.row;
  }
}