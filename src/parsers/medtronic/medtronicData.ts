import * as models from './../../models';
import checksum from './../../util/checksum';
import * as XLSX from 'xlsx';
import { DataSheet } from './dataSheet';
import { FlexSheet } from './flexSheet';

export class MedtronicData {
  private content: XLSX.WorkBook;
  private row: models.WorksheetRow = [];
  private dataSheet: XLSX.WorkSheet;
  private flexSheet: XLSX.WorkSheet;
  private deviceId: string;

  constructor(content: XLSX.WorkBook) {
    this.content = content;
    this.parseRow();
  }
  private parseRow() {
    this.dataSheet = this.content.Sheets['Data'];
    this.flexSheet = this.content.Sheets['Flex'];
    const dateSheet = new DataSheet(this.dataSheet);
    const flexSheet = new FlexSheet(this.flexSheet);

    this.deviceId = dateSheet.getSerialNumber();
    
    this.row.push(...dateSheet.parse());    
    this.row.push(...flexSheet.parse());    
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
    return this.deviceId;
  }
}