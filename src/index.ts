import { Command } from 'commander';
import * as commands from './commands';


const command = new Command();
command
  .version('0.0.1')
  .description('CLI for converting heart valves output data into Excel format')
  .option('-c, --checksum <device>', 'generates checksums of all log files for specific device type e.g.: StJude, Biotronik or Medtronik', commands.checksum)
  .option('-e, --excluded <device>', 'generates list of excluded log files for specific device type e.g.: StJude, Biotronik or Medtronik', commands.excludedFiles)
  .option('-i, --included <device>', 'generates list of included log files for specific device type e.g.: StJude, Biotronik or Medtronik', commands.includedFiles)
  .option('-w, --invalid <device>', 'generates list of wrong log files for specific device type e.g.: StJude, Biotronik or Medtronik', commands.invalidFiles)
  .parse(process.argv);

