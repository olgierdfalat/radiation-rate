import FileInfo from './fileInfo';
import * as constants from '../util/constants';
import { FileFilterCallback } from './filesEnumerator';
const stJudeRegExp = /\d+_?\d+?\.log/i;
const biotronikRegExp = /BIO_.*\.xml/i;
const biotronikStdRegExp = /BIOSTD.*\.xml/i;
const biotronikIEEERegExp = /BIOIEEE.*\.xml/i;

const DeviceFileFilters: Record<string, FileFilterCallback> = {
  [constants.STJUDE]: function isStJudeLogFile(fileInfo: FileInfo): boolean {
    return stJudeRegExp.test(fileInfo.fileName);
  },
  [constants.BIOTRONIK]: function isBiotronikStdXmlFile(fileInfo: FileInfo): boolean {
    return biotronikRegExp.test(fileInfo.fileName);
  },
  [constants.BIOTRONIK_STD]: function isBiotronikStdXmlFile(fileInfo: FileInfo): boolean {
    return biotronikStdRegExp.test(fileInfo.fileName);
  },
  [constants.Biotronik_IEEE]: function isBiotronikStdXmlFile(fileInfo: FileInfo): boolean {
    return biotronikIEEERegExp.test(fileInfo.fileName);
  }
};
export default DeviceFileFilters;