import * as errors from './../../errors';
import checksum from './../../util/checksum';
import {DOMParser} from 'xmldom';

const NODE_ELEMENT_TYPE: number = 1;

export class BiotronikStdData {
  private content: string;
  private xmlDoc: any;

  constructor(content: string) {
    this.content = content;
    this.parseXml();
  }

  private parseXml() {
    if (!this.content || this.content.length === 0) {
      throw new errors.NoContent();
    }
    this.content = this.content.replace(/carddas:/g, '');
    this.xmlDoc = new DOMParser().parseFromString(this.content);
  }

  getRow() {
    return this.xmlDoc;
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
    if(node.nodeType === NODE_ELEMENT_TYPE) {
      output.fieldNames += node.nodeName + '-';
      for(let i = 0; i < node.attributes.length; i++) {
        const attribute = node.attributes[i];
        output.fieldNames += attribute.name + '-';
      }      
    }

    const childNodes = node.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i];
      if(childNode.nodeType === NODE_ELEMENT_TYPE) {
        this.visitXmlDoc(childNode, level + 1, output);
      }
    }
  }
}