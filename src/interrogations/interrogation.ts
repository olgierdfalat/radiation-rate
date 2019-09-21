import * as fs from 'fs';
import { promisify } from 'util';
import yaml from 'js-yaml';
import * as parsers from './../parsers';
import sanitizeFilePath from './../util/sanitizeFilePath';

const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

export class Interrogation {
  private filePath: string;
  dateModified: Date;
  sanitizeFilePath: string;
  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async getContent(): Promise<string> {
    const fileStat = await stat(this.filePath);
    this.dateModified = fileStat.mtime;
    this.sanitizeFilePath = this.filePath;

    return (await readFile(this.filePath)).toString();
  }

  async getData(): Promise<any> {
    throw new Error('Not supported');
  }

  async getAsYaml() {
    return yaml.dump(await this.getData());
  }
}
