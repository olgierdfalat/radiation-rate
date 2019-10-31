import xpath from 'xpath';
import * as models from './../../models';
import { XmlParser } from '../xmlParser';
import { KeyValuePair } from './../../models';
import * as constants from './../../util/constants';

const icdClinicSelector = '//Paceart/PatientRecords/PatientRecord/Tests/ICDClinic';
const ICDClinic_Evaluation_TachyProgramming = 'ICDClinic_Evaluation_TachyProgramming';

export class BiotronikData extends XmlParser {
  private select: xpath.XPathSelect;

  constructor(content: string, filePath: string) {
    super(content, filePath);
  }
  private getField(selector: string, name: string, type: string): models.FieldModel {
    const value = this.select(selector, this.xmlDoc);
    return {
      name,
      value: value.toString(),
      type
    };
  }
  protected parseXml() {
    super.parseXml();
    this.select = xpath.useNamespaces({ 'bio': 'urn:biotronik' });
    const fileInformationSelector = '//Paceart/FileInformation';
    const icdSelector = '//Paceart/PatientRecords/PatientRecord/Devices/ICD';
    const icdDetailSelector = `${icdSelector}/ICDLookup/ICDDetail`;

    const demographicsSelector = '//Paceart/PatientRecords/PatientRecord/Demographics';
    const schemaVersion = this.getField(`string(${fileInformationSelector}/@SchemaVersion)`, 'schemaVersion', 'string');
    const institutionName = this.getField(`string(${fileInformationSelector}/@InstitutionName)`, 'institutionName', 'string');
    const generationDate = this.getField(`string(${fileInformationSelector}/@GenerationDate)`, 'generationDate', 'date');
    const nameLast = this.getField(`string(${demographicsSelector}/@nameLast)`, 'nameLast', 'string');
    const nameFirst = this.getField(`string(${demographicsSelector}/@nameFirst)`, 'nameFirst', 'string');
    const birthDate = this.getField(`string(${demographicsSelector}/@BirthDate)`, 'birthDate', 'date');
    const commentary = this.getField(`string(${demographicsSelector}/@Commentary)`, 'commentary', 'string');
    const serialNumber = this.getField(`string(${icdSelector}/@SerialNumber)`, 'serialNumber', 'string');
    const manufacturer = this.getField(`string(${icdDetailSelector}/@Manufacturer)`, 'manufacturer', 'string');
    const model = this.getField(`string(${icdDetailSelector}/@Model)`, 'model', 'string');
    const implantDate = this.getField(`string(${icdSelector}/ImplantInformation/@Date)`, 'implantDate', 'date');
    const icdClinic_Date = this.getField(`string(${icdClinicSelector}/@Date)`, 'icdClinic_Date', 'date');
    const icdClinic_Evaluation_BradyProgramming_PacingMode = this.getField(`string(${icdClinicSelector}/Evaluation/BradyProgramming/@PacingMode)`, 'PacingMode[ICDClinic_Evaluation_BradyProgramming]', 'string');
    const icdClinic_Evaluation_BradyProgramming_LowerRate_bpm = this.getField(`string(${icdClinicSelector}/Evaluation/BradyProgramming/@LowerRate_bpm)`, 'LowerRate_bpm[ICDClinic_Evaluation_BradyProgramming]', 'number');
    const icdClinic_Evaluation_BradyProgramming_HysteresisRate_bpm = this.getField(`string(${icdClinicSelector}/Evaluation/BradyProgramming/@HysteresisRate_bpm)`, 'HysteresisRate_bpm[ICDClinic_Evaluation_BradyProgramming]', 'number');
    const icdClinic_EvaluationBrady_Programming_TrackingRate_bpm = this.getField(`string(${icdClinicSelector}/Evaluation/BradyProgramming/@TrackingRate_bpm)`, 'TrackingRate_bpm[ICDClinic_EvaluationBrady_Programming]', 'number');
    const icdClinic_Evaluation_BradyProgramming_PMTIntervention = this.getField(`string(${icdClinicSelector}/Evaluation/BradyProgramming/@PMTIntervention)`, 'PMTIntervention[ICDClinic_Evaluation_BradyProgramming]', 'string');
    const icdClinic_Evaluation_BradyProgramming_PVCIntervention = this.select(`string(${icdClinicSelector}/Evaluation/BradyProgramming/@PVCIntervention)`, this.xmlDoc);
    const icdClinic_Evaluation_BradyProgramming_Notes = this.select(`string(${icdClinicSelector}/Evaluation/BradyProgramming/@Notes)`, this.xmlDoc);

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
      implantDate,
      icdClinic_Date,
      icdClinic_Evaluation_BradyProgramming_PacingMode,
      icdClinic_Evaluation_BradyProgramming_LowerRate_bpm,
      icdClinic_Evaluation_BradyProgramming_HysteresisRate_bpm,
      icdClinic_EvaluationBrady_Programming_TrackingRate_bpm,
      icdClinic_Evaluation_BradyProgramming_PMTIntervention
    };

    this.data['PVCIntervention[ICDClinic_Evaluation_BradyProgramming]'] = icdClinic_Evaluation_BradyProgramming_PVCIntervention;
    this.data['Notes[ICDClinic_Evaluation_BradyProgramming]'] = icdClinic_Evaluation_BradyProgramming_Notes;

    this.readNodesWithId(`${icdClinicSelector}/Evaluation/BradyProgramming/Sensing`, 'icdClinic_Evaluation_BradyProgramming_Sensing', 'Chamber');
    this.readNodesWithId(`${icdClinicSelector}/Evaluation/BradyProgramming/Pacing`, 'icdClinic_Evaluation_BradyProgramming_Pacing', 'Chamber');

    this.readNode(`${icdClinicSelector}/Evaluation/BradyProgramming/AVDelay`, 'icdClinic_Evaluation_BradyProgramming');
    this.readNode(`${icdClinicSelector}/Evaluation/BradyProgramming/AMS`, 'icdClinic_Evaluation_BradyProgramming');
    this.readNode(`${icdClinicSelector}/Evaluation/ICDTelemetry`, 'icdClinic_Evaluation');
    this.readNode(`${icdClinicSelector}/Evaluation/ICDTelemetry/Detections_Treatments`, 'icdClinic_Evaluation_ICDTelemetry');
    this.readNode(`${icdClinicSelector}/Evaluation/ICDTelemetry/Totals`, 'icdClinic_Evaluation_ICDTelemetry');

    this.readTachyProgramming();
  }

  // TODO: revisit method below.
  private readTachyProgramming() {
    const nodes = this.select(`${icdClinicSelector}/Evaluation/TachyProgramming`, this.xmlDoc);
    if (nodes.length > 0) {
      const tachyProgramming = nodes[0] as Element;
      if (tachyProgramming) {
        let zoneIndex = 1;
        for (let i = 0; i < tachyProgramming.childNodes.length; i++) {
          const zone = tachyProgramming.childNodes[i];
          if (zone.nodeType === constants.ELEMENT_NODE) {
            const zoneName = zone.nodeName;
            const zoneElement = zone as Element;
            for (let j = 0;  j < zoneElement.attributes.length; j++) {
              const attribute = zoneElement.attributes[j] as Attr;
              const name = attribute.name;
              const value = attribute.value;
              this.data[`${name}_${zoneIndex}_[${ICDClinic_Evaluation_TachyProgramming}_${zoneName}]`] = value;
            }
            this.readTherapies(zone, zoneName);
            zoneIndex++;
          }
        }
      }
    }
  }

  private readTherapies(zoneNode: ChildNode, zoneName: string) {
    for (let i = 0; i < zoneNode.childNodes.length; i++) {
      const therapy = zoneNode.childNodes[i];
      if (therapy.nodeType === constants.ELEMENT_NODE) {
        const therapyName = therapy.nodeName;
        const therapyElement = therapy as Element;
        const therapyNumber = therapyElement.getAttribute('TherapyNumber');
        for (let j = 0;  j < therapyElement.attributes.length; j++) {
          const attribute = therapyElement.attributes[j] as Attr;
          const name = attribute.name;
          const value = attribute.value;
          this.data[`${name}${therapyNumber}_[${ICDClinic_Evaluation_TachyProgramming}_${zoneName}_${therapyName}]`] = value;
        }
      }
    }
  }

  private readNodesWithId(selector: string, prefix: string, idAttribute: string) {
    const nodes = this.select(selector, this.xmlDoc);
    nodes.forEach(item => {
      const node = item as Node;
      const element = node as Element;
      if (element) {
        const id =  element.getAttribute(idAttribute) || '';
        if (id.length === 0) {
          throw `Id attribute not found: "${idAttribute}"`;
        }
        const newPrefix = prefix + '_' + id;
        this.readNodeWithAttributes(node, newPrefix, false).forEach(x => {
            this.data[x.key] = x.value;
        });
      }
    });
  }
  private readNode(selector: string, prefix: string) {
    const nodeSelect = this.select(selector, this.xmlDoc);
    if (nodeSelect.length > 0) {
      const node = nodeSelect[0] as Node;

      this.readNodeWithAttributes(node, prefix).forEach(x => {
        this.data[x.key] = x.value;
      });
    }
  }

  private readNodeWithAttributes(node: Node, prefix: string, includeName = true): KeyValuePair[] {
    const attributes: KeyValuePair[] = [];
    const name = node.nodeName;
    const element = node as Element;

    if (element) {
      for (let i = 0; i < element.attributes.length; i++) {
        const attribute = element.attributes[i];
        if (includeName) {
          attributes.push({key: `${attribute.name}[${prefix}_${name}]`, value: attribute.value});
        }
        else {
          attributes.push({key: `${attribute.name}[${prefix}]`, value: attribute.value});
        }
      }
    }
    return attributes;
  }

  getRow() {
    return this.data;
  }

  getExtraWorksheetRows(index = 0): models.WorksheetRow[] {
    return undefined;
  }

  getDeviceId(): string {
    const serialField = this.data.serialNumber;
    if (serialField) {
      return serialField.value;
    }
    return 'Unknown device id';
  }

  getWorksheetRow(): models.WorksheetRow {
    const worksheetRow: models.WorksheetRow = [];
    for (const key in this.data) {
        worksheetRow.push(this.data[key] as models.WorksheetField);
    }
    return worksheetRow;
  }
}