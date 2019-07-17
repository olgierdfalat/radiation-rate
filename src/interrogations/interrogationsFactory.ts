import * as models from '../models'
import {StJudeInterrogationsDataProvider} from '../interrogations/StJudeInterrogationsDataProvider';

export class InterrogationsFactory implements models.InterrogationsFactoryInterface {
  getDataProvider(device: string): models.DeviceDataProvider {
    if(device && device.toLowerCase() === 'stjude') {
      return new StJudeInterrogationsDataProvider();
    }
    throw new Error(`No data provider for "${device}".`);
  }
}