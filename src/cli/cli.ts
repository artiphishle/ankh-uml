import {build} from 'gluegun';

/**
 * Create the cli and kick it off
 */
async function run(argv) {
  // create a CLI runtime
  const cli = build()
    .brand('uml')
    .src(__dirname)
    .plugins('./node_modules', {matching: 'uml-*', hidden: true})
    .help()
    .version()
    .create();

  const toolbox = await cli.run(argv);

  return toolbox;
}

module.exports = {run};
