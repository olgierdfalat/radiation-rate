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
    this.dataSheetRows = XLSX.utils.sheet_to_json(dataSheet, {header: 1, raw: false});
    this.addExceptionalRules();
    this.parseManualStuff();
    this.parseCellsPairs('Model Identification:', 'Audit Rule(s)/Observations:');
    this.parseAuditRulesObservations();
    this.parseTimeOfLastBatteryMeasurement();
    this.parseLastLeadImpedanceMeasurements();
    this.parseChargeInformation();
    this.parsePatientProfileImplantDate();
    this.parsePatientAlerts();
  }
  private parseManualStuff() {
    this.row.push(this.parseCell('ToolGenerator', 1, 'A'));
    this.row.push(this.parseCell('Version', 2, 'A'));
    this.row.push(this.parseCell('Note', 3, 'A'));
    this.row.push(this.parseCell('LIA RAMware Status', 6, 'C'));
  }
  private parseCell(name: string, lineNumber: number, columnName: string, type = 'string'): models.WorksheetField {
    return {
      name,
      type,
      value: this.findValue(lineNumber, columnName)
    };
  }
  private addExceptionalRules() {
    const [fromRowIndex] = this.findCellIndex('Ventricular Blanking After Sensed Event:');
    if(fromRowIndex != null) {
      //add extra character(-) otherwise the following row will be ignored
      //Duration (days)	V-SICount	V-SIC First in Session	V-SIC duration	V-SIC Avg/day	A-SICount	A-SIC First in Session	A-SIC duration	A-SIC Avg/day
      this.dataSheetRows[fromRowIndex + 1].unshift('-'); 
    }
  }
  private parseAuditRulesObservations() {
    this.row.push({ name: 'Audit Rule(s)/Observations:', type: 'string', value: null });
    this.parseMergedCells('Audit Rule(s)/Observations:', 'Time Of Last Battery Measurement', 1);
  }

  private parseTimeOfLastBatteryMeasurement() {
    this.parseMergedCells('Time Of Last Battery Measurement', 'Last Lead Impedance Measurements', 0);
  }  
  
  private parseChargeInformation() {
    this.parseMergedCells('Charge Information:', 'Patient Profile Implant Date', 0);
  }

  private parseLastLeadImpedanceMeasurements() {
    const fromRowIndex = this.findCellIndex('Last Lead Impedance Measurements')[0];
    const toRowIndex = this.findCellIndex('Charge Information:')[0] - 2; //two lines gap between Last Lead Impedance Measurements and Charge Information
    let counter = 1;
    
    for(let i = fromRowIndex + 1; i < toRowIndex; i++) {
      this.dataSheetRows[i].unshift('Last Lead Impedance Measurement ' + counter);
      counter++;
    }

    this.parseMergedCells('Last Lead Impedance Measurements', 'Charge Information:', 0);
  }

  private parsePatientProfileImplantDate() {
    this.parseMergedCells('Patient Profile Implant Date', 'Patient Alerts:', 0);
  }
 
  private parsePatientAlerts() {
    this.parseMergedCells('Patient Alerts:', 'end-of-sheet', 0, 'Patient Alert '); //add prefix to avoid potential uniqueness issues
  }

  private parseMergedCells(from: string, to: string, cellsStartIndex = 0, namePrefix: string = null) {
    const fields: models.WorksheetField[] = [];
    const [fromRowIndex, fromColumnIndex] = this.findCellIndex(from);
    let [toRowIndex] = this.findCellIndex(to);
    if(to === 'end-of-sheet') {
      toRowIndex = this.dataSheetRows.length + 1; //exceptional rule, it reads to the end of sheet
    }
    let counter = 0;
    for(let i = fromRowIndex; i < toRowIndex - 1; i++, counter++) {      
      let name = this.findValueByIndex(i, fromColumnIndex + cellsStartIndex, true);
      if(counter > 0 && namePrefix) {
        name = namePrefix + name;
      }
      const mergedValues = this.mergeCells(i, fromColumnIndex + 1 + cellsStartIndex);
      const type = 'string'
      if(name) {
        fields.push( { name, type, value: mergedValues });
      }
    }
    this.row.push(...fields);
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
        fields.push({ name, type, value });
      }
    }
    
    this.row.push(...fields);
  }

  private mergeCells(rowIndex: number, startColumnIndex: number, trim = true, separator = ', '): string {
    const row = this.dataSheetRows[rowIndex];

    if(row && row.length > 0) {
      if(trim) {
        return row.map((item: any) => item ? item.trim(): item).slice(startColumnIndex).join(separator);
      }
      return row.slice(startColumnIndex).join(separator);
    }
    else {
      return null;
    }
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
  private findValueByIndex(rowIndex: number, columnIndex: number, trim = false) {
    const value = this.dataSheetRows[rowIndex][columnIndex];
    return trim ? (value || '').trim() : value;
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