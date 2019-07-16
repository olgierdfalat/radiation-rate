import { promises as fs } from 'fs';
import yaml from 'js-yaml';

export default async function dumpToFile(filePath: string, data: any) {
  await fs.writeFile(filePath, yaml.dump(data));
  console.log('Data saved in:', filePath);
}