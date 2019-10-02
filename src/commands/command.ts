import * as constants from './../util/constants';

export default function execute(device: string, callback: (device: string) => void): any  {
  const supportedDevices = [constants.STJUDE, constants.BIOTRONIK_STD, constants.MEDTRONIK];
  const normalizedDevice = device.toLowerCase();
  if (device && supportedDevices.indexOf(normalizedDevice) === -1) {
    console.error(`The "${device}" is not supported type, please use StJude, BiotronikStd or Medtronik.`);
    return;
  }

  return callback(normalizedDevice);
}
