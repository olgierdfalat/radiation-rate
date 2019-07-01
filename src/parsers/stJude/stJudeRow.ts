import * as models from './../../models';
import * as parsers from './../index';
import { StJudeField } from './stJudeField';

export class StJudeRow {
  private fieldParser = new parsers.StJudeField();
  private row: models.StJudeRowModel = [];
  getRow(content: string): models.StJudeRowModel {
    const lines = content.split('\n');

    lines.forEach(line => {
      const field = this.fieldParser.getField(line);
      if (field) {
        this.row.push(field);
      }
    });
    this.row = this.row.sort((a: models.StJudeFieldModel, b: models.StJudeFieldModel) => a.id - b.id);
    return this.row;
  }
}