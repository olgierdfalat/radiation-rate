import * as models from './../../models';
import { Worksheet } from './worksheet';

export class Datasheet extends Worksheet {

  constructor(worksheetRows: any) {
    super(worksheetRows);
  }

  parse(): models.WorksheetRow {

    this.addExceptionalRules();
    this.parseManualStuff();
    this.parseCellsPairs('Model Identification:', 'Audit Rule(s)/Observations:');
    this.parseAuditRulesObservations();
    this.parseTimeOfLastBatteryMeasurement();
    this.parseLastLeadImpedanceMeasurements();
    this.parseChargeInformation();
    this.parsePatientProfileImplantDate();
    this.parsePatientAlerts();

    return this.row;
  }

  private addExceptionalRules() {
    const [fromRowIndex] = this.findCellIndex('Ventricular Blanking After Sensed Event:');
    if (fromRowIndex != undefined) {
      // add extra character(-) otherwise the following row will be ignored
      // Duration (days)	V-SICount	V-SIC First in Session	V-SIC duration	V-SIC Avg/day	A-SICount	A-SIC First in Session	A-SIC duration	A-SIC Avg/day
      this.worksheetRows[fromRowIndex + 1].unshift('-');
    }
  }

  private parseManualStuff() {
    this.row.push(this.parseCell('ToolGenerator', 1, 'A'));
    this.row.push(this.parseCell('Version', 2, 'A'));
    this.row.push(this.parseCell('Note', 3, 'A'));
    this.row.push(this.parseCell('LIA RAMware Status', 6, 'C'));
  }

  private parseAuditRulesObservations() {
    this.row.push({ name: 'Audit Rule(s)/Observations:', type: 'string', value: undefined });
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
    const toRowIndex = this.findCellIndex('Charge Information:')[0] - 2; // two lines gap between Last Lead Impedance Measurements and Charge Information
    let counter = 1;

    for (let i = fromRowIndex + 1; i < toRowIndex; i++) {
      this.worksheetRows[i].unshift('Last Lead Impedance Measurement ' + counter);
      counter++;
    }
    this.parseMergedCells('Last Lead Impedance Measurements', 'Charge Information:', 0);
  }

  private parsePatientProfileImplantDate() {
    this.parseMergedCells('Patient Profile Implant Date', 'Patient Alerts:', 0);
  }

  private parsePatientAlerts() {
    this.parseMergedCells('Patient Alerts:', 'end-of-sheet', 0, 'Patient Alert '); // add prefix to avoid potential uniqueness issues
  }
}
