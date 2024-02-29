import {AnkhUml} from 'src/tool/uml/Uml';
import {ERenderer} from 'src/types/types';

// Test
new AnkhUml()
  .parse({rootFile: './src/examples/one-dependency/User.ts'})
  .render({outDir: '.', renderer: ERenderer.PlantUml});
