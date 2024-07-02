import {Sequence} from "./Sequence";

import {resolve, dirname, basename} from "path";
import {Ast} from 'src/util/ast.util';
import {readSync, writeSync} from 'src/util/fs.util';
import {EErrRenderer} from 'src/types/error.constants';
import {ERenderer, type IModule, type ParseOptions, type RenderOptions} from 'src/types/types';
import {
  createSourceFile,
  forEachChild,
  isClassDeclaration,
  ScriptTarget,
  type Node,
} from 'typescript';

export class AnkhUml {
  private modules: IModule[] = [];
  private rootPath: string = "";

  parse({rootFile}: ParseOptions) {

    console.log('\n/////\n\n[UML::parse]', 'rootFile:', basename(rootFile));
    
    if(!this.rootPath){
      this.rootPath = dirname(rootFile);
      console.log("[UML::parse]","rootPath:", this.rootPath);
    }
    
    if (!rootFile?.endsWith('.ts')) {
      // Quick preview of relations
      this.modules.push({
        class: rootFile,
        methods: [],
        properties: [],
      } as IModule);
      return this;
    }
    const content = readSync(rootFile);
    const ast = createSourceFile(rootFile, content, ScriptTarget.ES2020, true);

    const imp = Ast.getImports(ast);

    imp.forEach(({path})=> this.parse({rootFile: resolve(this.rootPath, `${path}.ts`)}))

      
  forEachChild(ast, (n: Node) => {
      if (!isClassDeclaration(n)) return;

      const methods = Ast.getMethods(n.members);
      const props = Ast.getProperties(n.members);
      /*
      const c = Ast.getConstructor(node.members);
      const params = Ast.getConstructorParams(c?.parameters);
      const instantiated = Ast.getInstantiatedClasses(c?.body);
      const instantiated = Ast.getInstantiatedClasses(Ast.getMethod(node.members).body);
      */
      const clss = n.name?.getText();
      if(!clss) return;
      
      const module: IModule = {
        instantiated: imp.map(({name})=> name),
        class: clss,
        methods: Ast.getMethodJson(methods),
        properties: Ast.getPropertiesJson(props),
      };
      
      this.modules.push(module);
    });

    return this;
  }

  render({renderer, outDir}: RenderOptions) {
    switch (renderer) {
      case ERenderer.Mermaid:
        return this.renderMermaid(outDir);
      case ERenderer.PlantUml:
        return this.renderPlantUml(outDir);
      default:
        throw new Error(EErrRenderer.Invalid);
    }
  }

  private renderMermaid(outDir: string) {
    console.info('🧜‍♀️ Mermaid support to follow.', outDir);
  }

  private renderPlantUml(outDir: string) {
    const fields = this.modules.map((module) => ({
class: `\nclass ${module.class}\n`,
      methods: module.methods
        .map((method) => `  ${method.private ? '-' : '+'}${method.returnType} ${method.name}()\n`)
        .join(''),
      properties: module.properties
        .map((property) => `  -${property.name}\n`)
        .join(''),
    }));

    const puml = fields
      .map((uml) => `${uml.class}{\n${uml.properties}${uml.methods}}\n`)
      .join('');

    const relations = this.modules
      .map((module) => {
        return module.instantiated
          ?.map((subClass) => `${module.class} --> ${subClass}\n`)
          .join('');
      })
      .join('');

    writeSync(
      `${outDir}/uml.puml`,
      `@startuml ankh-uml\ntitle UML\n${puml}\n\n${relations}\n@enduml`
    );

    return this;
  }
}

const [rootFile, outDir, seq] = process.argv.slice(2)

if(seq) new Sequence().parse(rootFile);

else new AnkhUml()
.parse({rootFile})
  .render({renderer: ERenderer.PlantUml, outDir});
