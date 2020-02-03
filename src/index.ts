import { Command } from 'commander';
import * as commands from './commands';


const command = new Command();
command
  .version('0.0.5')
  .description('CLI for converting heart valves output data into Excel format')
  .option('-x, --excel <device>', 'generates Excel files for specific device type e.g.: StJude, Biotronik, BiotronikStd, BiotronikIEEE or Medtronic', commands.exportToExcel)
  .option('-u, --unique <device>', 'copy unique source files for specific device type e.g.: StJude, Biotronik, BiotronikStd, BiotronikIEEE or Medtronic', commands.copy)
  .option('-c, --checksum <device>', 'generates checksums of all log files for specific device type e.g.: StJude, Biotronik, BiotronikStd, BiotronikIEEE or Medtronic', commands.checksum)
  .option('-e, --excluded <device>', 'generates list of excluded log files for specific device type e.g.: StJude, Biotronik, BiotronikStd, BiotronikIEEE or Medtronic', commands.excludedFiles)
  .option('-i, --included <device>', 'generates list of included log files for specific device type e.g.: StJude, Biotronik, BiotronikStd, BiotronikIEEE or Medtronic', commands.includedFiles)
  .option('-w, --invalid <device>', 'generates list of wrong log files for specific device type e.g.: StJude, BiotronikStd, BiotronikIEEE or Medtronic', commands.invalidFiles)
  .parse(process.argv);

