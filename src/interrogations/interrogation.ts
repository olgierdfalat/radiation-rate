import * as fs from 'fs';
import * as models from './../models';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);


export class Interrogation {
  private fileName: string;
  constructor(fileName: string) {
    this.fileName = fileName;
  }

  async getContent(): Promise<string> {
    return (await readFile(this.fileName)).toString();
  }

  async getRow(): Promise<models.StJudeRowModel> {
    throw new Error('Not supported');
  }
}
