import path from 'path';
import { homedir } from 'os';

export default function sanitiseFilePath(filePath: string) {
  return filePath.replace(path.join(homedir(), 'Desktop'), '');
}