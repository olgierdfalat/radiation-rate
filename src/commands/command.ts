import * as constants from './../util/constants';

export default function execute(device: string, callback: (device: string) => void): any  {
  const supportedDevices = [constants.STJUDE, constants.BIOTRONIK, constants.BIOTRONIK_STD, constants.Biotronik_IEEE, constants.MEDTRONIC];
  const normalizedDevice = device.toLowerCase();
  if (device && supportedDevices.indexOf(normalizedDevice) === -1) {
    console.error(`The "${device}" is not supported type, please use StJude, Biotronik, BiotronikStd, BiotronikIEEE or Medtronic.`);
    return;
  }

  return callback(normalizedDevice);
}
