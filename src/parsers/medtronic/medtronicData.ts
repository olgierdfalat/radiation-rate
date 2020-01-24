import * as models from './../../models';
import * as parsers from './../index';
import checksum from './../../util/checksum';
import * as errors from './../../errors';
import * as XLSX from 'xlsx';

export class MedtronicData {
  private content: XLSX.WorkBook;
  private row: models.WorksheetRow = [];
  private dataSheetRows : any;
  
  constructor(content: XLSX.WorkBook) {
    this.content = content;
    this.parseRow();
  }
  private parseRow() {
    const dataSheet = this.content.Sheets['Data'];
    this.dataSheetRows = XLSX.utils.sheet_to_json(this.content.Sheets['Data'], {header: 1, raw: false});
    this.parseManualStuff();
  }
  private parseManualStuff() {
    this.row.push(this.parseCell('ToolGenerator', 1, 'A'));
    this.row.push(this.parseCell('Version', 2, 'A'));
    this.row.push(this.parseCell('Note', 3, 'A'));
    this.row.push(this.parseCell('LIA RAMware Status', 6, 'C'));
    this.parseCellsPairs('Model Identification:', 'Audit Rule(s)/Observations:');
  }
  private parseCell(name: string, lineNumber: number, columnName: string, type = 'string'): models.WorksheetField {
    return {
      name,
      type,
      value: this.findValue(lineNumber, columnName)
    };
  }
  private parseCellsPairs(from: string, to: string) {
    const fields: models.WorksheetField[] = [];
    const [fromRowIndex, fromColumnIndex] = this.findCellIndex(from);
    const [toRowIndex] = this.findCellIndex(to);
    for(let i = fromRowIndex; i < toRowIndex - 1; i++) {      
      const name = this.findValueByIndex(i, fromColumnIndex);
      const value = this.findValueByIndex(i, fromColumnIndex + 1);
      let type = 'string'
      if(name) {
        if(name.includes('Timestamp')) {
          type = 'date';
        }
        fields.push( { name, type, value });
      }
    }
    
    this.row.push(...fields);
  }
  private findCellIndex(value: string): [number, number] {
    for(let i = 0; i < this.dataSheetRows.length; i++) {
        const row = this.dataSheetRows[i];
        for(let j = 0; j < row.length; j++) {
          const cellValue = row[j];
          if(value === cellValue) {
            return [i, j];
          }
        }
    }
    return [-1, -1];
  }
  private findValueByIndex(rowIndex: number, columnIndex: number) {
    return this.dataSheetRows[rowIndex][columnIndex];
  }
  private findValue(lineNumber: number, columnName: string) {
    return this.dataSheetRows[lineNumber - 1][this.columnToNumber(columnName) - 1];
  }

  private columnToNumber(name: String) : number {
    const base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let i = 0, j = 0, result = 0;
  
    for (i = 0, j = name.length - 1; i < name.length; i += 1, j -= 1) {
      result += Math.pow(base.length, j) * (base.indexOf(name[i]) + 1);
    }
    return result;
  };

  getRow() {
    return this.row;
  }
  getWorksheetRow(): models.WorksheetRow {
    return this.row;
  }
  getExtraWorksheetRows(index = 0): models.WorksheetRow[] {
    return undefined;
  }
  getIdsChecksum() {
    const ids = this.getRow().map(row => row.name);
    return checksum(ids.join('-'));
  }
  getChecksum() {    
    const values = this.getRow().map(row => `${row.name}|${row.value}`);
    return checksum(values.join('-'));
  }
  getDeviceId(): string {
    throw 'Not implemented';
    return undefined;
  }
}