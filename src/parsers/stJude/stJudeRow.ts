import * as models from './../../models';
import * as parsers from './../index';
import checksum from './../../util/checksum';
export class StJudeRow {
  private fieldParser = new parsers.StJudeField();
  private row: models.StJudeRowModel;
  private content: string;
  constructor(content: string) {
    this.content = content;
  }
  getRow(): models.StJudeRowModel {
    this.row = [];
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
  getIdsChecksum() {
    const ids = this.getRow().map(row => row.id);
    return checksum(ids.join('-'))
  }
  getChecksum() {
    return checksum(this.content);
  }
}