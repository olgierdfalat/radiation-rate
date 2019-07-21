import { Exporter } from './exporter';

export class Excel extends Exporter  {
   constructor(folderPath: string, device: string) {
     super(folderPath, device);
   }
}