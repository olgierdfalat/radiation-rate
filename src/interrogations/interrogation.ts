import * as fs from "fs";
import { promisify } from "util";

const readFile = promisify(fs.readFile);


export class Interrogation {
  private fileName: string;
  constructor(fileName: string) {
    this.fileName = fileName;
  }

  async getContent(): Promise<string> {
    return (await readFile(this.fileName)).toString();
  }

  async getData(): Promise<any> {
    throw new Error("Not supported");
  }
}
