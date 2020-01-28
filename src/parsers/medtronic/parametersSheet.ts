import * as XLSX from 'xlsx';
import { WorkSheet } from './worksheet';
import * as models from './../../models';

type UniqueRow = [string, number];
type UniqueRowArray = UniqueRow[];

export class ParametersSheet extends WorkSheet {
  constructor(workSheet: XLSX.WorkSheet) {
    super(workSheet);
  }
  private fixDuplicateNames() {
    const uniqueRows: UniqueRowArray = [];

    for (let i = 0; i < this.worksheetRows.length; i++) {
      const row = this.worksheetRows[i];
      if (row && row.length > 0) {
        const name = row[0];
        if (name) {
          const foundRows = uniqueRows.filter((row: UniqueRow) => {
            const [currentName] = row;
            return name === currentName;
          });
          if (foundRows.length > 0) {
            const foundRow = foundRows[0];
            const [currentName, counter] = foundRow;
            const newCounter = counter + 1;
            foundRow[1] = newCounter;
            const newName = currentName.trim() + '\u2219'.repeat(newCounter); // extra small dots(∙)
            uniqueRows.push([newName, 0]);
            row[0] = newName;
          }
          else {
            uniqueRows.push([name, 0]);
          }
        }
      }
    }
  }
  parse(): models.WorksheetRow {
    this.fixDuplicateNames();
    return super.parse();
  }
}