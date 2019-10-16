import { Interrogation } from './interrogation';
import * as parsers from '../parsers';

export class BiotronikIEEE extends Interrogation {
  async getData(): Promise<parsers.BiotronikIEEEData> {
    const content = await this.getContent();
    return new parsers.BiotronikIEEEData(content, this.filePath);
  }
}