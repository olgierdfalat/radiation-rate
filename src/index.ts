import { Command } from 'commander';
const command = new Command();
command
  .version('0.0.1')
  .description('CLI for converting heart valves output data into Excel format')
  .option('-c, --checksum <device>', 'generates checksums of all log files for specific device type e.g.: StJude, Biotronik or Medtronik', checksum)
  .parse(process.argv);


function checksum(device: string) {
  const supportedDevices = ['stjude', 'biotronik', 'medtronik'];
  if (device && supportedDevices.indexOf(device.toLowerCase()) === -1) {
    console.error(`The "${device}" is not supported type, please use StJude, Biotronik or Medtronik.`);
    return;
  }

  console.log('Generating checksums for', device, 'devices.');

}