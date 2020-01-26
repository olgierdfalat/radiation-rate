import * as XLSX from 'xlsx';
import { WorkSheet } from './worksheet';
import * as models from './../../models';

export class PORSheet extends WorkSheet {
  constructor(workSheet: XLSX.WorkSheet) {
    super(workSheet);
  }

  parse(): models.WorksheetRow {
    const porRows = Array<[string, string[]]>();
    for(let i = 0; i < this.worksheetRows.length; i++) {
      const row = this.worksheetRows[i];
      const [name, value] = row;
      if(name) {
        porRows.push([name, [value]]);
      }
      else {
        const prevRow = porRows[porRows.length - 1];
        if(prevRow && value) {          
          prevRow[1].push(value);
        }
      }      
    }
    porRows.forEach(row => {
      const [name, values] = row;
      this.row.push({
        name,
        type: 'string',
        value: values.join(', ')
      });
    });

    return this.row;
  }
}