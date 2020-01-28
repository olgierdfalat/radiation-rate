import { Interrogation, StJude, Biotronik, BiotronikStd, BiotronikIEEE, Medtronic } from './index';
import * as constants from './../util/constants';

export abstract class InterrogationFactory {
  static getInterrogation(device: string, filePath: string): Interrogation {
    const normalizedDevice = device.toLowerCase();
    switch (normalizedDevice) {
      case constants.STJUDE:
        return new StJude(filePath);
      case constants.BIOTRONIK:
        return new Biotronik(filePath);
      case constants.BIOTRONIK_STD:
        return new BiotronikStd(filePath);
      case constants.Biotronik_IEEE:
        return new BiotronikIEEE(filePath);
      case constants.MEDTRONIC:
        return new Medtronic(filePath);
    }
    throw new Error(`Cannot create Interrogation object. The "${device}" is not supported.`);
  }
}