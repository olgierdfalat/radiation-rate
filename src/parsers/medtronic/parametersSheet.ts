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
        const values = row.splice(1).map((value: any) => (value || '').trim());
        if(name) {
          this.row.push({name: name.trim(), type: 'string', value: values.join(', ')});
        }
      }
    }
    return this.row;
  }
}