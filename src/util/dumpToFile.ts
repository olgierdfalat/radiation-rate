import { promises as fs } from 'fs';
import yaml from 'js-yaml';

export default async function dumpToFile(filePath: string, data: any) {
  return await fs.writeFile(filePath, yaml.dump(data));
}