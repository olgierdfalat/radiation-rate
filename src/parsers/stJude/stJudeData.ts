import * as models from './../../models';
import * as parsers from './../index';
import checksum from './../../util/checksum';
import * as errors from './../../errors';

export class StJudeData {
  private fieldParser = new parsers.StJudeField();
  private row: models.StJudeRowModel;
  private content: string;
  constructor(content: string) {
    this.content = content;
    this.parseRow();
  }
  private parseRow() {
    this.row = [];
    if (!this.content || this.content.length === 0) {
      throw new errors.NoContent();
    }
    const lines = this.content.split('\n');

    lines.forEach(line => {
      const field = this.fieldParser.getField(line);
      if (field) {
        this.row.push(field);
      }
    });
    this.row = this.row.sort((a: models.StJudeFieldModel, b: models.StJudeFieldModel) => a.id - b.id);
    return this.row;
  }
  getRow(): models.StJudeRowModel {
    return this.row;
  }
  getIdsChecksum() {
    const ids = this.getRow().map(row => row.id);
    return checksum(ids.join('-'));
  }
  getChecksum() {
    return checksum(this.content);
  }
  getDeviceId(): string {
    const field = this.row.find(field => field.name === 'Device Serial Number');
    if (field) {
      return field.firstValue.toString();
    }
    return undefined;
  }
}