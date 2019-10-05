import { DOMParser } from 'xmldom';
import xpath from 'xpath';
import * as errors from './../errors';
import * as models from './../models';
const ELEMENT_NODE = 1;

export class XmlParser {
  protected content: string;
  protected xmlDoc: any;
  protected stdData: any;
  protected filePath: string;

  constructor(content: string, filePath: string) {
    this.content = content;
    this.filePath = filePath;
    this.parseXml();
  }

  protected parseXml() {
    if (!this.content || this.content.length === 0) {
      throw new errors.NoContent();
    }
    console.log(`Parsing data from ${this.filePath}.`);
    this.content = this.content.replace(/carddas:/g, '');
    this.xmlDoc = new DOMParser().parseFromString(this.content);
  }

  protected parseElement(selector: string, type: string) {
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
  protected parseStringElement(selector: string): models.FieldModel  {
    return this.parseElement(selector, 'string');
  }

  protected parseDateElement(selector: string): models.FieldModel {
    return this.parseElement(selector, 'date');
  }

  protected parseTimeElement(selector: string): models.FieldModel {
    return this.parseElement(selector, 'time');
  }

  protected parseAttribute(selector: string, type: string): models.FieldModel {
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

  protected parseStringAttribute(selector: string): models.FieldModel {
    return this.parseAttribute(selector, 'string');
  }

  protected parseDateAttribute(selector: string): models.FieldModel {
    return this.parseAttribute(selector, 'date');
  }

  protected parseTimeAttribute(selector: string): models.FieldModel {
    return this.parseAttribute(selector, 'time');
  }

  protected getLastElementValue(childNodes: NodeListOf<Node>): string {
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

  protected visitXmlDoc(node: any, level: number, output: any) {
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

  protected getValue(selector: string, element: Element): string {
    const childElement = xpath.select1(selector, element) as Element;
    if (childElement) {
      if (childElement.firstChild) {
        return childElement.firstChild.nodeValue;
      }
    }
    return undefined;
  }
}