import {GluegunCommand} from 'gluegun';
import {AnkhUml} from '../../tool/uml/Uml';
import {ERenderer} from 'src/types/types';

const command: GluegunCommand = {
  name: 'uml',
  run: async (toolbox) => {
    const {parameters, print} = toolbox;

    print.info('ankh-uml --rootFile={path/to/class.ts}');
    print.info(parameters.options);

    new AnkhUml()
      .parse({rootFile: parameters.options.rootFile})
      .render({renderer: ERenderer.PlantUml, outDir: './'});
  },
};

module.exports = command;
