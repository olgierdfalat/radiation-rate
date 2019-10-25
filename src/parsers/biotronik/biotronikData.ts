import xpath from 'xpath';
import * as models from './../../models';
import { XmlParser } from '../xmlParser';

const NR = 'NR';
const SERIAL_NUMBER_DATA = 'SERHSM[Table=TBU_DEFI_DATA]';
const SERIAL_NUMBER_DATEN = 'SERHSM[Table=TBU_HSM_DATEN]';

export class BiotronikData extends XmlParser {
  private episodes: models.FieldModel[][];

  constructor(content: string, filePath: string) {
    super(content, filePath);
  }

  protected parseXml() {
    super.parseXml();
    const select = xpath.useNamespaces({'bio': 'urn:biotronik'});
    const fileInformationSelector = '//Paceart/FileInformation';
    const icdSelector = '//Paceart/PatientRecords/PatientRecord/Devices/ICD';
    const icdDetailSelector = `${icdSelector}/ICDLookup/ICDDetail`;
    const demographicsSelector = '//Paceart/PatientRecords/PatientRecord/Demographics';
    const schemaVersion = select(`string(${fileInformationSelector}/@SchemaVersion)`, this.xmlDoc);
    const institutionName = select(`string(${fileInformationSelector}/@InstitutionName)`, this.xmlDoc);
    const generationDate = select(`string(${fileInformationSelector}/@GenerationDate)`, this.xmlDoc);
    const nameLast = select(`string(${demographicsSelector}/@nameLast)`, this.xmlDoc);
    const nameFirst = select(`string(${demographicsSelector}/@nameFirst)`, this.xmlDoc);
    const birthDate = select(`string(${demographicsSelector}/@BirthDate)`, this.xmlDoc);
    const commentary = select(`string(${demographicsSelector}/@Commentary)`, this.xmlDoc);
    const serialNumber = select(`string(${icdSelector}/@SerialNumber)`, this.xmlDoc);
    const manufacturer = select(`string(${icdDetailSelector}/@Manufacturer)`, this.xmlDoc);
    const model = select(`string(${icdDetailSelector}/@Model)`, this.xmlDoc);
    const implantDate = select(`string(${icdSelector}/ImplantInformation/@Date)`, this.xmlDoc);
    this.data = {
      schemaVersion,
      institutionName,
      generationDate,
      nameLast,
      nameFirst,
      birthDate,
      commentary,
      serialNumber,
      manufacturer,
      model,
      implantDate
    };
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