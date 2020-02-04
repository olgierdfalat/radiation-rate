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
          const energyTable: any[][] = [];

          for (let j = i; j < energyTableRowEndIndex; j++) {
            const energyRow: [] = this.worksheetRows[j];

            energyTable.push(energyRow.filter((row, index) => index > 1));
          }
          energyTable.forEach((row, rowIndex) => {
            row.forEach((value, columnIndex)  => {
              const cellName = `Energy Table[${rowIndex + 1},${columnIndex + 1}]`;
              this.row.push({name: cellName, type: 'string', value});
            });
          });
        }
      }
    }
    return this.row;
  }
}