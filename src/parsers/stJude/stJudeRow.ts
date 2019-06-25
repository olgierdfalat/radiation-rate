import * as models from './../../models';
import * as parsers from './../index';

export class StJudeRow {
  private fieldParser = new parsers.StJudeField();
  getRow(content: string): models.StJudeRowModel {
    const lines = content.split('\n');
    const row: models.StJudeRowModel = [];
    lines.forEach(line => {
      const field = this.fieldParser.getField(line);
      if (field) {
        row.push(field);
      }
    });
    return row;
  }
}