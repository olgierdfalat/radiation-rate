import { Interrogation } from './interrogation';
import * as parsers from '../parsers';

export class BiotronikStd extends Interrogation {
  async getData(): Promise<parsers.BiotronikStdData> {
    const content = await this.getContent();
    return new parsers.BiotronikStdData(content, this.filePath);
  }
}