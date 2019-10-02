import FileInfo from './fileInfo';
import * as constants from '../util/constants';
import { FileFilterCallback } from './filesEnumerator';
const stJudeRegExp = /\d+_?\d+?\.log/i;
const biotronikStdRegExp = /BIOSTD.*\.xml/i;

const DeviceFileFilters: Record<string, FileFilterCallback> = {
  [constants.STJUDE]: function isStJudeLogFile(fileInfo: FileInfo): boolean {
    return stJudeRegExp.test(fileInfo.fileName);
  },
  [constants.BIOTRONIK_STD]: function isBiotronikStdXmlFile(fileInfo: FileInfo): boolean {
    return biotronikStdRegExp.test(fileInfo.fileName);
  }
};
export default DeviceFileFilters;