import {readSync, writeSync} from 'src/util/fs.util';
import {mustMatchTsFile} from 'src/util/string.util';
import {EErrRenderer} from 'src/types/error.constants';
import {ERenderer, ParseOptions, RenderOptions} from 'src/types/types';
import {
  createSourceFile,
  forEachChild,
  isClassDeclaration,
  isMethodDeclaration,
  isPropertyDeclaration,
  ScriptTarget,
  SyntaxKind,
  type MethodDeclaration,
  type Node,
  type PropertyDeclaration,
} from 'typescript';

export class AnkhUml {
  private module;

  constructor() {}

  parse({rootFile}: ParseOptions) {
    // if (!mustMatchTsFile(rootFile)) return;

    const content = readSync(rootFile);
    const ast = createSourceFile(rootFile, content, ScriptTarget.ES2020, true);

    forEachChild(ast, (node: Node) => {
      if (!isClassDeclaration(node)) return;
      const methods = node.members.filter((member) =>
        isMethodDeclaration(member)
      ) as MethodDeclaration[];
      const properties = node.members.filter((member) =>
        isPropertyDeclaration(member)
      ) as PropertyDeclaration[];

      this.module = {
        class: node,
        methods: methods.map((method) => ({
          name: method?.name?.getText(),
          private: method.modifiers.some(
            (modifier) => modifier.kind === SyntaxKind.PrivateKeyword
          ),
        })),
        properties: properties.map((property) => ({
          name: property.name?.getText(),
        })),
      };
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
    const uml = {
      class: `class ${this.module.class.name?.getText()}\n`,
      methods: this.module.methods
        .map((method) => `  ${method.private ? '-' : '+'}${method.name}()\n`)
        .join(''),
      properties: this.module.properties
        .map((property) => `  -${property.name}\n`)
        .join(''),
    };
    const puml = `@startuml UML\n${uml.class}{\n${uml.properties}${uml.methods}}\n@enduml`;
    writeSync(`${outDir}/${this.module.class.name?.getText()}.puml`, puml);

    return this;
  }
}
