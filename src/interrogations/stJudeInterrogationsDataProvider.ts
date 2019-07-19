import * as models from './../models';
import { StJudeData } from './../parsers';

export class StJudeInterrogationsDataProvider implements models.DeviceDataProvider {
  getData(folderPath: string): models.DeviceData {
    throw new Error('Method not implemented.');
  }
}