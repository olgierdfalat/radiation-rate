import { DOMParser } from 'xmldom';
import xpath, { SelectedValue } from 'xpath';
import * as errors from './../../errors';
import checksum from './../../util/checksum';
import * as models from './../../models';

const ELEMENT_NODE = 1;
const NR = 'NR';
const SERIAL_NUMBER_DATA = 'SERHSM[Table=TBU_DEFI_DATA]';
const SERIAL_NUMBER_DATEN = 'SERHSM[Table=TBU_HSM_DATEN]';

export class BiotronikStdData {
  private content: string;
  private xmlDoc: any;
  private stdData: any;
  private filePath: string;
  private episodes: models.FieldModel[][];

  constructor(content: string, filePath: string) {
    this.content = content;
    this.filePath = filePath;
    this.parseXml();
  }

  private parseElement(selector: string, type: string) {
    const node = xpath.select1(selector, this.xmlDoc) as Element;
    if (node) {
      return {
        name: node.nodeName,
        value: node.firstChild.nodeValue,
        type
      };
    }

    return {
      name: '',
      value: '',
      type: 'unknown'
    };
  }
  private parseStringElement(selector: string): models.FieldModel  {
    return this.parseElement(selector, 'string');
  }

  private parseDateElement(selector: string): models.FieldModel {
    return this.parseElement(selector, 'date');
  }

  private parseTimeElement(selector: string): models.FieldModel {
    return this.parseElement(selector, 'time');
  }

  private parseAttribute(selector: string, type: string): models.FieldModel {
    const attribute = xpath.select1(selector, this.xmlDoc) as Attr;
    if (attribute) {
      return {
        name: attribute.name,
        value: attribute.value,
        type
      };
    }
    return {
      name: '',
      value: '',
      type: 'unknown'
    };
  }

  private parseStringAttribute(selector: string): models.FieldModel {
    return this.parseAttribute(selector, 'string');
  }

  private parseDateAttribute(selector: string): models.FieldModel {
    return this.parseAttribute(selector, 'date');
  }

  private parseTimeAttribute(selector: string): models.FieldModel {
    return this.parseAttribute(selector, 'time');
  }

  private getLastElementValue(childNodes: NodeListOf<Node>): string {
    let value = undefined;
    let element: Element = undefined;
    for (const key in childNodes) {
      const node = childNodes[key];
      if (node.nodeType === ELEMENT_NODE) {
        element = node as Element;
      }
    }
    if (element && element.firstChild) {
      value = element.firstChild.nodeValue;
    }

    return value;
  }
  private parseTableEntries(selector: string, includeTablePostfix = true, includeTableArgumentPostfix = false): models.FieldModel[] {
    function getValue(selector: string, element: Element): string {
      const childElement = xpath.select1(selector, element) as Element;
      if (childElement) {
        if (childElement.firstChild) {
          return childElement.firstChild.nodeValue;
        }
      }
      return undefined;
    }
    const entires: models.FieldModel[] = [];
    const entries = xpath.select(selector, this.xmlDoc);

    entries.forEach(entry => {
      const element = entry as Element;
      if (element) {
        const tableName = getValue('./../TableName', element);
        let name = includeTablePostfix ? getValue('./AttributeName', element) + `[Table=${tableName}]` : getValue('./AttributeName', element);
        const type = getValue('./AttributeType', element);
        const value = this.getLastElementValue(element.childNodes);
        if (includeTableArgumentPostfix) {
          const attributeID = getValue('./AttributeID', element);
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

  private parseXml() {
    if (!this.content || this.content.length === 0) {
      throw new errors.NoContent();
    }
    console.log(`Parsing data from ${this.filePath}.`);
    this.content = this.content.replace(/carddas:/g, '');
    this.xmlDoc = new DOMParser().parseFromString(this.content);

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

    this.stdData = {
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

    measurementsEntries.forEach(x => this.stdData[x.name] = x);
    additionalMeasurements.forEach(x => this.stdData[x.name] = x);
    this.episodes = episodes;
  }

  getRow() {
    return this.stdData;
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
    const serialField = this.stdData[SERIAL_NUMBER_DATA] || this.stdData[SERIAL_NUMBER_DATEN];
    if (serialField) {
      return serialField.value;
    }
    return 'Unknown device id';
  }

  getChecksum() {
    return checksum(this.content);
  }

  getIdsChecksum() {
    const output = {fieldNames: ''};
    this.visitXmlDoc(this.xmlDoc.documentElement, 0, output);
    return checksum(output.fieldNames);
  }

  getWorksheetRow(): models.WorksheetRow {
    const worksheetRow: models.WorksheetRow = [];
    for (const key in this.stdData) {
      if (key !== 'episodes') {
        worksheetRow.push(this.stdData[key] as models.WorksheetField);
      }
    }
    return worksheetRow;
  }

  private visitXmlDoc(node: any, level: number, output: any) {
    if (node.nodeType === ELEMENT_NODE) {
      output.fieldNames += node.nodeName + '-';
      for (let i = 0; i < node.attributes.length; i++) {
        const attribute = node.attributes[i];
        output.fieldNames += attribute.name + '-';
      }
    }

    const childNodes = node.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i];
      if (childNode.nodeType === ELEMENT_NODE) {
        this.visitXmlDoc(childNode, level + 1, output);
      }
    }
  }
}