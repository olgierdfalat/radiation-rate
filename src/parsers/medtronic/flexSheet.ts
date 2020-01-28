import * as XLSX from 'xlsx';
import { WorkSheet } from './worksheet';
import * as models from './../../models';

export class FlexSheet extends WorkSheet {
  constructor(workSheet: XLSX.WorkSheet) {
    super(workSheet);
  }

  parse(): models.WorksheetRow {
    for (let i = 0; i < this.worksheetRows.length; i++) {
      const row = this.worksheetRows[i];
      let [name, value] = row;
      if (name) {
        name = name.trim();
        if (value) {
          value = value.trim();
        }
        if (name !== 'Energy Table') {
          this.row.push({name, type: 'string', value});
        }
        else {
          const energyTableRowEndIndex = this.findNextNotEmptyRowIndex(i, 1);
          const energyTable = [];
          for (let j = i; j < energyTableRowEndIndex; j++) {
            const energyRow = this.worksheetRows[j];
            energyTable.push(energyRow.slice(2));
          }
          this.row.push({name, type: 'array', value: energyTable.map(item => item.join(', ')).join('\n')});
        }
      }
    }
    return this.row;
  }
}