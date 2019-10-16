import * as models from './../../models';
import { XmlParser } from './../xmlParser';
import * as constants from './../../util/constants';

const SERIAL_NUMBER = 'SERIAL[MDC:IDC:DEV]';

export class BiotronikIEEEData extends XmlParser {
  private episodes: models.FieldModel[][];

  constructor(content: string, filePath: string) {
    super(content, filePath);
  }

  private parseEpisode(element: Element): models.FieldModel[] {
    const episode: models.FieldModel[] = [];
    for (let i = 0; i < element.childNodes.length; i++) {
      const childNode = element.childNodes[i];
      if (childNode.nodeType === constants.ELEMENT_NODE) {
        episode.push(this.parseValue(childNode as Element, [], false));
      }
    }
    return episode;
  }

  private parseValue(element: Element, parentSectionsNames: string[], includeSectionNames = true): models.FieldModel {
    const unit = element.getAttribute('unit');
    const name = element.getAttribute('name') + (includeSectionNames ? `[${parentSectionsNames.join(':')}]` : '') + (unit ? `[${unit}]` : '');
    const type = element.getAttribute('type');
    const value = (element.firstChild.nodeValue || '').trim();
    return {
      name,
      type,
      value
    };
  }

  private visitSections(node: any, parentSectionsNames: string[]) {
    const childNodes = node.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const element = childNodes[i] as Element;
      if (element) {
        if (element.nodeType === constants.ELEMENT_NODE) {
          if (element.tagName === 'section') {
              const sectionName = element.getAttribute('name');
              if (sectionName !== 'EPISODE') {
              parentSectionsNames.push(sectionName);
              this.visitSections(element, parentSectionsNames);
              parentSectionsNames = [];
            }
            else {
              this.episodes.push(this.parseEpisode(element));
            }
          }
          else if (element.tagName === 'value') {
            const value: models.FieldModel = this.parseValue(element, parentSectionsNames);
            this.data[value.name] = value;
          }
          else {
            this.visitSections(element, parentSectionsNames);
          }
        }
      }
    }
  }

  protected parseXml() {
    super.parseXml();
    this.episodes = [];
    this.visitSections(this.xmlDoc.documentElement, []);
    this.data['episodes'] = this.episodes;
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
    const serialField = this.data[SERIAL_NUMBER];
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