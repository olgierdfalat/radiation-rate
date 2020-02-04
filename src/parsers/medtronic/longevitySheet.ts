import * as XLSX from 'xlsx';
import { WorkSheet } from './worksheet';
import * as models from './../../models';

export class LongevitySheet extends WorkSheet {
  constructor(workSheet: XLSX.WorkSheet) {
    super(workSheet);
  }
  private pivotVerticallyRows(firstHeaderName: string) {
    const [rowIndex, columnIndex] = this.findCellIndex(firstHeaderName);

   const pivotedRows: any = [];
    if (rowIndex != -1 && columnIndex != -1) {
      const headers = this.worksheetRows[rowIndex];
      let counter = rowIndex + 1;
      let cells = this.worksheetRows[counter];
      while (cells.length > 0) {
        const transposeCells = this.transpose1d(cells, headers);
        transposeCells.forEach(cell => {
          pivotedRows.push(cell);
        });

        counter++;
        cells = this.worksheetRows[counter];
      }
      this.worksheetRows.splice(rowIndex, counter - rowIndex, ...pivotedRows);
    }
  }
  private transpose1d(cells: string[], headers: string[]): any[][] {
    const result = [];
    if (cells.length > 0) {
      const namePrefix = cells[0];
      for (let i = 1; i < cells.length; i++) {
        const value = cells[i];
          const header = headers[i];
          result.push([`${namePrefix} ${header}`, value]);

      }
    }
    return result;
  }
  parse(): models.WorksheetRow {
    this.pivotVerticallyRows('Pulse Width [ms]');
    this.pivotVerticallyRows('Mean [months]');


    for (let i = 0; i < this.worksheetRows.length; i++) {
      const row = this.worksheetRows[i];
      if (row && row.length > 0) {
        const name = row[0];
        const values = row.splice(1).map((value: any) => (value || '').trim());

        if (name) {
          if (values.length > 1) {
            for (let j = 0; j < values.length; j++) {
              const indexedName = name.trim() + `[col. ${j + 1}]`;
              this.row.push({name: indexedName, type: 'string', value: values[j]});
            }
          }
          else {
              this.row.push({name: name.trim(), type: 'string', value: values[0]});
          }

        }
      }
    }
    return this.row;


  }


}