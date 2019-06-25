import { Interrogation } from './interrogation';
import * as parsers from './../parsers';
import * as models from './../models';

export class StJude extends Interrogation {
  private rowParser = new parsers.StJudeRow();
  async getRow(): Promise<models.StJudeRowModel> {
    const content = await this.getContent();
    return this.rowParser.getRow(content);
  }
}