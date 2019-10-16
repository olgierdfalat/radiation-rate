import xpath from 'xpath';
import * as models from './../../models';
import { XmlParser } from '../xmlParser';

const NR = 'NR';
const SERIAL_NUMBER_DATA = 'SERHSM[Table=TBU_DEFI_DATA]';
const SERIAL_NUMBER_DATEN = 'SERHSM[Table=TBU_HSM_DATEN]';

export class BiotronikStdData extends XmlParser {
  private episodes: models.FieldModel[][];

  constructor(content: string, filePath: string) {
    super(content, filePath);
  }

  private parseTableEntries(selector: string, includeTablePostfix = true, includeTableArgumentPostfix = false): models.FieldModel[] {
    const entires: models.FieldModel[] = [];
    const entries = xpath.select(selector, this.xmlDoc);

    entries.forEach(entry => {
      const element = entry as Element;
      if (element) {
        const tableName = this.getValue('./../TableName', element);
        let name = includeTablePostfix ? this.getValue('./AttributeName', element) + `[Table=${tableName}]` : this.getValue('./AttributeName', element);
        const type = this.getValue('./AttributeType', element);
        const value = this.getLastElementValue(element.childNodes);
        if (includeTableArgumentPostfix) {
          const attributeID = this.getValue('./AttributeID', element);
          name = `${name}[Table=${tableName}:Id=${attributeID}]`;
        }
        entires.push({name, type, value});
      }
    });
    return entires;
  }

  private parseEpisodes(selector: string): models.FieldModel[][] {
    const entries = this.parseTableEntries(selector, false);
    const episodes: models.FieldModel[][] = [];
    let record: models.FieldModel[] = [];
    entries.forEach(e => {
      if (e.name === NR) {
        record = [];
        episodes.push(record);
      }

      record.push(e);
    });
    return episodes;
  }

  protected parseXml() {
    super.parseXml();

    const interfaceDataSelector = '//InterfaceData';
    const interfaceDataSource = this.parseStringAttribute(`${interfaceDataSelector}/@Source`);
    const interfaceDataDestination = this.parseStringAttribute(`${interfaceDataSelector}/@Destination`);
    const interfaceDataCreationDate = this.parseDateAttribute(`${interfaceDataSelector}/@CreationDate`);
    const interfaceDataCreationTime = this.parseTimeAttribute(`${interfaceDataSelector}/@CreationTime`);

    const personalDataSelector = '//Patient/PersonalData';
    const personalDataFirstName = this.parseStringElement(`${personalDataSelector}/FirstName`);
    const personalDataLastName = this.parseStringElement(`${personalDataSelector}/LastName`);
    const personalDataDateOfBirth = this.parseDateElement(`${personalDataSelector}/DateOfBirth`);

    const admissionSelector = '//Admission';
    const admissionDate = this.parseDateElement(`${admissionSelector}/AdmissionDate`);
    const admissionTime = this.parseTimeElement(`${admissionSelector}/AdmissionTime`);

    const examinationSelector = '//Examination';
    const examinationDate = this.parseDateElement(`${examinationSelector}/ExaminationDate`);
    const examinationTime = this.parseTimeElement(`${examinationSelector}/ExaminationTime`);
    const examinationFunctionalDomain = this.parseStringElement(`${examinationSelector}/FunctionalDomain`);
    const measurementsEntries = this.parseTableEntries('//Examination/Measurements/Table/TableEntry');
    const episodes = this.parseEpisodes('//Examination/Measurements/Table/ForeignKey/TableEntry');
    const additionalMeasurements = this.parseTableEntries('//Examination/AdditionalMeasurements/Table/TableEntry', false, true);

    this.data = {
      interfaceDataDestination,
      interfaceDataSource,
      interfaceDataCreationDate,
      interfaceDataCreationTime,
      personalDataFirstName,
      personalDataLastName,
      personalDataDateOfBirth,
      admissionDate,
      admissionTime,
      examinationDate,
      examinationTime,
      examinationFunctionalDomain,
      episodes
    };

    measurementsEntries.forEach(x => this.data[x.name] = x);
    additionalMeasurements.forEach(x => this.data[x.name] = x);
    this.episodes = episodes;
  }

  getRow() {
    return this.data;
  }

  getExtraWorksheetRows(index = 0): models.WorksheetRow[] {
    if (index === 0) {
      return this.episodes.map(episode => {
        return episode.map(field => {
          return {
            name: field.name,
            type: field.type,
            value: field.value
          };
        });
      });
    }
    return undefined;
  }

  getDeviceId(): string {
    const serialField = this.data[SERIAL_NUMBER_DATA] || this.data[SERIAL_NUMBER_DATEN];
    if (serialField) {
      return serialField.value;
    }
    return 'Unknown device id';
  }

  getWorksheetRow(): models.WorksheetRow {
    const worksheetRow: models.WorksheetRow = [];
    for (const key in this.data) {
      if (key !== 'episodes') {
        worksheetRow.push(this.data[key] as models.WorksheetField);
      }
    }
    return worksheetRow;
  }
}