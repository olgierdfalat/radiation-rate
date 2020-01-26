import { Interrogation } from './interrogation';
import * as parsers from '../parsers';
import * as XLSX from 'xlsx';

export class Medtronic extends Interrogation {
  async getContent(): Promise<XLSX.WorkBook> {
    return XLSX.readFile(this.filePath, {cellDates: true});
  }
  async getData(): Promise<parsers.MedtronicData> {
    const content = await this.getContent();
    return new parsers.MedtronicData(content);
  }
}