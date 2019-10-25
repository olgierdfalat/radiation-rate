import { Interrogation } from './interrogation';
import * as parsers from '../parsers';

export class Biotronik extends Interrogation {
  async getData(): Promise<parsers.BiotronikData> {
    const content = await this.getContent();
    return new parsers.BiotronikData(content, this.filePath);
  }
}