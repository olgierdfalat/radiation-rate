import { Interrogation } from './interrogation';
import * as parsers from './../parsers';

export class StJude extends Interrogation {
  async getData(): Promise<parsers.StJudeData> {
    const content = await this.getContent();
    return new parsers.StJudeData(content);
  }
}