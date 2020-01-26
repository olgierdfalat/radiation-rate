import * as models from './../../models';
import checksum from './../../util/checksum';
import * as XLSX from 'xlsx';
import { DataSheet } from './dataSheet';
import { FlexSheet } from './flexSheet';
import { PORSheet } from './porSheet';
import { ParametersSheet } from './parametersSheet';

export const DATA = 'Data';

export class MedtronicData {
  private content: XLSX.WorkBook;
  private row: models.WorksheetRow = [];
  private dataWorkSheet: XLSX.WorkSheet;
  private flexWorkSheet: XLSX.WorkSheet;
  private porWorkSheet: XLSX.WorkSheet;
  private parametersSheet: XLSX.WorkSheet;
  private deviceId: string;
  private dataSheetRows: models.WorksheetRow;

  constructor(content: XLSX.WorkBook) {
    this.content = content;
    this.parseRow();
  }
  private parseRow() {
    //this.Sheets = {};
    this.dataWorkSheet = this.content.Sheets['Data'];
    this.flexWorkSheet = this.content.Sheets['Flex'];
    this.porWorkSheet = this.content.Sheets['POR'];
    this.parametersSheet = this.content.Sheets['Parameters'];
    const dateSheet = new DataSheet(this.dataWorkSheet);
    this.dataSheetRows = dateSheet.parse();
    //this.Sheets[DATA] = this.dataSheetRows;
    const flexSheet = new FlexSheet(this.flexWorkSheet);
    const porSheet = new PORSheet(this.porWorkSheet);
    const parametersSheet = new ParametersSheet(this.parametersSheet);

    this.deviceId = dateSheet.getSerialNumber();
    
    this.row.push(...this.dataSheetRows);
    this.row.push(...flexSheet.parse());    
    this.row.push(...porSheet.parse());    
    //this.row.push(...parametersSheet.parse());    
  }

  //Sheets: { [sheet: string]: models.WorksheetRow };

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