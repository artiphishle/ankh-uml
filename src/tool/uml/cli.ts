import {join} from 'path';
import {AnkhUml} from 'src/tool/uml/Uml';
import {ERenderer} from 'src/types/types';

// Test
const rootFile = join(__dirname, '../src/examples/_exampleApp/User.ts');
new AnkhUml()
  .parse({rootFile})
  .render({outDir: '.', renderer: ERenderer.PlantUml});
