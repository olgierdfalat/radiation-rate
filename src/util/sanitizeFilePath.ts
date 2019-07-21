import path from 'path';
import { homedir } from 'os';

export default function sanitizeFilePath(filePath: string) {
  return filePath.replace(path.join(homedir(), 'Desktop'), '');
}