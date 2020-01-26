import * as models from './../../models';
import * as parsers from './../index';
import checksum from './../../util/checksum';
import * as errors from './../../errors';
import * as XLSX from 'xlsx';
import { Datasheet } from './dataSheet';

export class MedtronicData {
  private content: XLSX.WorkBook;
  private row: models.WorksheetRow = [];
  private dataSheet: XLSX.WorkSheet;

  constructor(content: XLSX.WorkBook) {
    this.content = content;
    this.parseRow();
  }
  private parseRow() {
    this.dataSheet = this.content.Sheets['Data'];
    const dataSheetRows = XLSX.utils.sheet_to_json(this.dataSheet, {header: 1, raw: false});
    this.row.push(...new Datasheet(dataSheetRows).parse());
  }

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