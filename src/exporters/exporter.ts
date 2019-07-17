import { includedFiles } from './../commands/filterFiles';
import FileInfo from './../io/fileInfo';

export class Exporter {
  private folderPath: string;
  constructor(folderPath: string) {
    this.folderPath = folderPath;
  }
}