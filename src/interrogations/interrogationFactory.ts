import { Interrogation, StJude, BiotronikStd } from './index';
import * as constants from './../util/constants';


export abstract class InterrogationFactory {
  static getInterrogation(device: string, filePath: string): Interrogation {
    const normalizedDevice = device.toLowerCase();
    switch (normalizedDevice) {
      case constants.STJUDE:
        return new StJude(filePath);
      case constants.BIOTRONIK_STD:
        return new BiotronikStd(filePath);
    }
    throw new Error(`Cannot create Interrogation object. The "${device}" is not supported.`);
  }
}