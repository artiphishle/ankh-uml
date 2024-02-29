import {GluegunCommand} from 'gluegun';
import {AnkhUml} from 'src/tool/uml/Uml';

export const command: GluegunCommand = {
  name: 'uml',
  run: async (toolbox) => {
    const {parameters, print} = toolbox;
    const {renderer, rootFile, outDir} = parameters.options;

    print.info('ankh-uml --rootFile={path/to/class.ts}');
    print.info(parameters.options);

    console.log('rootFile', rootFile);
    new AnkhUml().parse({rootFile}).render({renderer, outDir});
  },
};
