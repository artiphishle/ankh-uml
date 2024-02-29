import {readSync, writeSync} from 'src/util/fs.util';
import {EErrRenderer} from 'src/types/error.constants';
import {ERenderer, IModule, ParseOptions, RenderOptions} from 'src/types/types';
import {
  Block,
  ClassElement,
  createSourceFile,
  forEachChild,
  isClassDeclaration,
  isConstructorDeclaration,
  isMethodDeclaration,
  isPropertyDeclaration,
  NodeArray,
  ParameterDeclaration,
  ScriptTarget,
  SyntaxKind,
  type MethodDeclaration,
  type Node,
  type PropertyDeclaration,
} from 'typescript';

const Ast = {
  getMethods: (nodeArray: NodeArray<ClassElement>) =>
    nodeArray.filter(
      (node) => isMethodDeclaration(node) && node
    ) as MethodDeclaration[],

  getConstructor: (nodeArray: NodeArray<ClassElement>) =>
    nodeArray.find(isConstructorDeclaration),

  getConstructorParams: (params: NodeArray<ParameterDeclaration>) =>
    params.map((param) => param.name?.getText()),

  getProperties: (nodeArray: NodeArray<ClassElement>) =>
    nodeArray.filter(
      (node) => isPropertyDeclaration(node) && (node as PropertyDeclaration)
    ),

  getPropertiesJson: (properties) =>
    properties.map((property) => ({name: property.name?.getText()})),

  getMethodJson: (methods: MethodDeclaration[]) =>
    methods.map((node) => ({
      name: node.name?.getText(),
      private: node.modifiers.some(
        (modifier) => modifier.kind === SyntaxKind.PrivateKeyword
      ),
    })),

  getInstantiatedClasses: (block: Block, result = []) => {
    forEachChild(block, (body) => {
      body.forEachChild((child) => {
        if (SyntaxKind[child.kind] !== 'BinaryExpression') return result;
        forEachChild(child, (token) => {
          forEachChild(token, (t) => {
            if (SyntaxKind[token.kind] !== 'NewExpression') return result;
            token.forEachChild((child) => result.push(child.getText()));
          });
        });
      });
    });
    return result;
  },
};

export class AnkhUml {
  private modules: IModule[] = [];

  constructor() {}

  parse({rootFile}: ParseOptions) {
    if (rootFile.split('.').length === 1) {
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

    forEachChild(ast, (node: Node) => {
      if (!isClassDeclaration(node)) return;

      const methods = Ast.getMethods(node.members);
      const properties = Ast.getProperties(node.members);
      const constructor = Ast.getConstructor(node.members);
      // const params = Ast.getConstructorParams(constructor?.parameters);
      const instantiated = Ast.getInstantiatedClasses(constructor?.body);

      const module: IModule = {
        instantiated,
        class: node.name.getText(),
        methods: Ast.getMethodJson(methods),
        properties: Ast.getPropertiesJson(properties),
      };

      if (module.class) this.modules.push(module);

      instantiated.forEach((subClass) => {
        this.parse({rootFile: subClass});
      });
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
      class: `class ${module.class}\n`,
      methods: module.methods
        .map((method) => `  ${method.private ? '-' : '+'}${method.name}()\n`)
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
      `@startuml ankh-uml\ntitle Call Stack\n${puml}\n\n${relations}\n@enduml`
    );

    return this;
  }
}
