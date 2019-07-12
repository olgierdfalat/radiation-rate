import FileInfo from './fileInfo';
const regExp = /\d+_?\d+?\.log/i;

export function isStJudeLogFile(fileInfo: FileInfo): boolean {
  return regExp.test(fileInfo.fileName);
}