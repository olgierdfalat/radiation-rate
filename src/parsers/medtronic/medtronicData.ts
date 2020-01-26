import * as models from './../../models';
import checksum from './../../util/checksum';
import * as XLSX from 'xlsx';
import { DataSheet } from './dataSheet';
import { FlexSheet } from './flexSheet';
import { PORSheet } from './porSheet';
import { ParametersSheet } from './parametersSheet';
import { throws } from 'assert';

export const DATA = 'Data';
export const FLEX = 'Flex';
export const POR = 'POR';
export const PARAMETERS = 'Parameters';

export class MedtronicData {
  private content: XLSX.WorkBook;
  private row: models.WorksheetRow = [];
  private dataWorkSheet: XLSX.WorkSheet;
  private flexWorkSheet: XLSX.WorkSheet;
  private porWorkSheet: XLSX.WorkSheet;
  private parametersSheet: XLSX.WorkSheet;
  private deviceId: string;

  constructor(content: XLSX.WorkBook) {
    this.content = content;
    this.parseRow();
  }
  private parseRow() {
    this.Sheets = {};
    this.dataWorkSheet = this.content.Sheets[DATA];
    this.flexWorkSheet = this.content.Sheets[FLEX];
    this.porWorkSheet = this.content.Sheets[POR];    
    this.parametersSheet = this.content.Sheets[PARAMETERS];
    
    const dateSheet = new DataSheet(this.dataWorkSheet);
    const dataSheetRows = dateSheet.parse();
    this.Sheets[DATA] = dataSheetRows;

    const flexSheet = new FlexSheet(this.flexWorkSheet);
    const flexSheetRows = flexSheet.parse();
    this.Sheets[FLEX] = flexSheetRows;

    const porSheet = new PORSheet(this.porWorkSheet);
    const porSheetRows = porSheet.parse();
    this.Sheets[POR] = porSheetRows;

    const parametersSheet = new ParametersSheet(this.parametersSheet);
    const parametersSheetRows = parametersSheet.parse();
    this.Sheets[PARAMETERS] = parametersSheetRows;

    this.deviceId = dateSheet.getSerialNumber();
    
    this.row.push(...dataSheetRows);
    this.row.push(...flexSheetRows);    
    this.row.push(...porSheetRows);    
    this.row.push(...parametersSheetRows);    
  }

  Sheets: { [sheet: string]: models.WorksheetRow };

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