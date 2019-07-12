import * as fs from 'fs';
import * as parsers from './../parsers';
import { promisify } from 'util';
import yaml from 'js-yaml';

const readFile = promisify(fs.readFile);


export class Interrogation {
  private fileName: string;
  constructor(fileName: string) {
    this.fileName = fileName;
  }

  async getContent(): Promise<string> {
    return (await readFile(this.fileName)).toString();
  }

  async getData(): Promise<parsers.StJudeData> {
    throw new Error('Not supported');
  }

  async getAsYaml() {
    return yaml.dump(await this.getData());
  }
}
