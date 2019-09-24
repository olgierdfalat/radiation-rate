import {DOMParser} from 'xmldom';
import xpath from 'xpath';
import * as errors from './../../errors';
import checksum from './../../util/checksum';
import * as models from './../../models';

const ELEMENT_NODE = 1;

export class BiotronikStdData {
  private content: string;
  private xmlDoc: any;
  private stdData: any;

  constructor(content: string) {
    this.content = content;
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
    }
  }
  private parseStringElement(selector: string): models.FieldModel  {
    return this.parseElement(selector, 'string')
  }

  private parseDateElement(selector: string): models.FieldModel {
    return this.parseElement(selector, 'date')
  }
  
  private parseTimeElement(selector: string): models.FieldModel {
    return this.parseElement(selector, 'time')
  }

  private parseAttribute(selector: string, type: string) : models.FieldModel {
    const attribute = xpath.select1(selector, this.xmlDoc) as Attr;
    if(attribute) {
      return {
        name: attribute.name,
        value: attribute.value,
        type
      }
    }
    return {
      name: '',
      value: '',
      type: 'unknown'
    }
  }

  private parseStringAttribute(selector: string) : models.FieldModel {
    return this.parseAttribute(selector, 'string');
  }

  private parseDateAttribute(selector: string) : models.FieldModel {
    return this.parseAttribute(selector, 'date');
  }

  private parseTimeAttribute(selector: string) : models.FieldModel {
    return this.parseAttribute(selector, 'time');
  }

  private parseXml() {
    if (!this.content || this.content.length === 0) {
      throw new errors.NoContent();
    }
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
      examinationFunctionalDomain
    };    
  }

  getRow() {
    return this.stdData;
  }

  getChecksum() {
    return checksum(this.content);
  }

  getIdsChecksum() {
    const output = {fieldNames: ''};
    this.visitXmlDoc(this.xmlDoc.documentElement, 0, output);
    return checksum(output.fieldNames);
  }

  private visitXmlDoc(node: any, level: number, output: any) {
    if(node.nodeType === ELEMENT_NODE) {
      output.fieldNames += node.nodeName + '-';
      for(let i = 0; i < node.attributes.length; i++) {
        const attribute = node.attributes[i];
        output.fieldNames += attribute.name + '-';
      }      
    }

    const childNodes = node.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i];
      if(childNode.nodeType === ELEMENT_NODE) {
        this.visitXmlDoc(childNode, level + 1, output);
      }
    }
  }
}