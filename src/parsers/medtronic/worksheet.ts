import * as XLSX from 'xlsx';
import * as models from './../../models';

export class WorkSheet {
  protected workSheet: XLSX.WorkSheet;
  protected worksheetRows: any;
  protected row: models.WorksheetRow = [];
  constructor(workSheet: XLSX.WorkSheet) {
    this.workSheet = workSheet;
    this.worksheetRows = this.parseRows();
  }

  protected parseRows() {
    return XLSX.utils.sheet_to_json(this.workSheet, {header: 1, raw: false});
  }
  private columnToNumber(name: String): number {
    const base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let i = 0, j = 0, result = 0;

    for (i = 0, j = name.length - 1; i < name.length; i += 1, j -= 1) {
      result += Math.pow(base.length, j) * (base.indexOf(name[i]) + 1);
    }
    return result;
  }

  protected findValueByIndex(rowIndex: number, columnIndex: number, trim = false) {
    const value = this.worksheetRows[rowIndex][columnIndex];
    return trim ? (value || '').trim() : value;
  }
  protected findValue(lineNumber: number, columnName: string) {
    return this.worksheetRows[lineNumber - 1][this.columnToNumber(columnName) - 1];
  }

  protected findCellIndex(value: string): [number, number] {
    for (let i = 0; i < this.worksheetRows.length; i++) {
        const row = this.worksheetRows[i];
        for (let j = 0; j < row.length; j++) {
          const cellValue = row[j];
          if (value === cellValue) {
            return [i, j];
          }
        }
    }
    return [-1, -1];
  }

  protected parseCell(name: string, lineNumber: number, columnName: string, type = 'string'): models.WorksheetField {
    return {
      name,
      type,
      value: this.findValue(lineNumber, columnName)
    };
  }

  protected parseCellsPairs(from: string, to: string) {
    const fields: models.WorksheetField[] = [];
    const [fromRowIndex, fromColumnIndex] = this.findCellIndex(from);
    const [toRowIndex] = this.findCellIndex(to);
    for (let i = fromRowIndex; i < toRowIndex - 1; i++) {
      const name = this.findValueByIndex(i, fromColumnIndex);
      const value = this.findValueByIndex(i, fromColumnIndex + 1);
      let type = 'string';
      if (name) {
        if (name.includes('Timestamp')) {
          type = 'date';
        }
        fields.push({ name, type, value });
      }
    }

    this.row.push(...fields);
  }

  protected parseMergedCells(from: string, to: string, cellsStartIndex = 0, namePrefix: string = undefined) {
    const fields: models.WorksheetField[] = [];
    const [fromRowIndex, fromColumnIndex] = this.findCellIndex(from);
    let [toRowIndex] = this.findCellIndex(to);
    if (to === 'end-of-sheet') {
      toRowIndex = this.worksheetRows.length + 1; // exceptional rule, it reads to the end of sheet
    }
    let counter = 0;
    for (let i = fromRowIndex; i < toRowIndex - 1; i++, counter++) {
      let name = this.findValueByIndex(i, fromColumnIndex + cellsStartIndex, true);
      if (counter > 0 && namePrefix) {
        name = namePrefix + name;
      }
      const mergedValues = this.mergeCells(i, fromColumnIndex + 1 + cellsStartIndex);
      const type = 'string';
      if (name) {
        fields.push( { name, type, value: mergedValues });
      }
    }
    this.row.push(...fields);
  }

  protected mergeCells(rowIndex: number, startColumnIndex: number, trim = true, separator = ', '): string {
    const row = this.worksheetRows[rowIndex];

    if (row && row.length > 0) {
      if (trim) {
        return row.map((item: any) => item ? item.trim() : item).slice(startColumnIndex).join(separator);
      }
      return row.slice(startColumnIndex).join(separator);
    }
    else {
      return undefined;
    }
  }

  protected findNextNotEmptyRowIndex(currentRowIndex: number, columnIndex: number): number {
    let nextNotEmptyRowIndex = -1;
    const maxRowIndex = this.worksheetRows.length;
    let i = currentRowIndex;
    while ((i++) < maxRowIndex) {
      const row = this.worksheetRows[i];
      const cells = row[columnIndex];
      if (cells && cells.length > 0) {
        const name = cells[columnIndex];
        if (name) {
          nextNotEmptyRowIndex = i;
          break;
        }
      }
    }

    return nextNotEmptyRowIndex;
  }

  fixEmptyName(nearestName: string, newName: string) {
    const [rowIndex, columnIndex] = this.findCellIndex(nearestName);
    if (rowIndex != -1 && columnIndex > 0) {
      this.worksheetRows[rowIndex][columnIndex - 1] = newName; // new name to solve uniqueness issue
    }
  }

  parse(): models.WorksheetRow {
    for (let i = 0; i < this.worksheetRows.length; i++) {
      const row = this.worksheetRows[i];
      if (row && row.length > 0) {
        const name = row[0];
        const values = row.splice(1).map((value: any) => (value || '').trim());
        if (name) {
          this.row.push({name: name.trim(), type: 'string', value: values.join(', ')});
        }
      }
    }
    return this.row;
  }
}