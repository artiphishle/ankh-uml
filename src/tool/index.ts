import yargs from 'yargs/yargs';
import {hideBin} from 'yargs/helpers';
// const yargs = require('yargs/yargs');
// const {hideBin} = require('yargs/helpers');

export function getOptions() {
  yargs(hideBin(process.argv))
    .command(
      'uml [rootFile]',
      'generate uml from root file',
      (yargs) => {
        return yargs.positional('rootFile', {
          describe: 'file to start from',
          default: 'src/examples/_exampleApp/User.ts',
        });
      },
      (argv) => {
        if (argv.verbose) console.info(`start server on :${argv.port}`);
      }
    )
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Run with verbose logging',
    })
    .parse();
}
