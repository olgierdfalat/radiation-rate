import { Interrogation } from './interrogation';
import * as parsers from './../parsers';
import * as models from './../models';

export class StJude extends Interrogation {
  async getData(): Promise<models.StJudeRowModel> {
    const content = await this.getContent();
    const rowParser = new parsers.StJudeData(content);
    return rowParser.getRow();
  }
}