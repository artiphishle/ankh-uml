import {resolve, dirname, basename} from "path";
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
  isImportDeclaration,
  isMethodDeclaration,
  isPropertyDeclaration,
  isNamespaceImport,
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

  getMethod: (nodeArray: NodeArray<ClassElement>) =>
    nodeArray.find(isMethodDeclaration),

  getConstructor: (nodeArray: NodeArray<ClassElement>) =>
    nodeArray.find(isConstructorDeclaration),

  getConstructorParams: (params: NodeArray<ParameterDeclaration>) =>
    params.map((param) => param.name?.getText()),

  getImports: (sourceFile: any) => {
    const importModules: {name: string; path: string}[]= [];
    
    forEachChild(sourceFile, (node: Node)=> {
      if(!isImportDeclaration(node)) return importModules;
      const importClause = node.importClause;
      const moduleSpecifier = node.moduleSpecifier.getText(sourceFile);
      const namedBindings = importClause?.namedBindings;
      if(!namedBindings || isNamespaceImport(namedBindings)) return;

      namedBindings.elements.forEach((element) => {
    const namedImport = element.name.getText(sourceFile);
    if(element.isTypeOnly) return;
    
    importModules.push({name: namedImport, path: moduleSpecifier.slice(1,-1)});

    });
    
    });
    
    if(importModules.length) console.log("\n[Ast::getImports]",importModules.map(({name})=> name).join(", "));
    
    return importModules;
  },
  
  getProperties: (nodeArray: NodeArray<ClassElement>) =>
    nodeArray.filter(
      (node) => isPropertyDeclaration(node) && (node as PropertyDeclaration)
    ),

  getPropertiesJson: (properties: any) =>
    properties.map((property: any) => ({name: property.name?.getText()})),

  getMethodJson: (methods: MethodDeclaration[]) =>
    methods.map((node) => ({
      name: node.name?.getText(),
      private: node.modifiers?.some(
        (modifier) => modifier.kind === SyntaxKind.PrivateKeyword
      ) || false,
    })),

  recursiveSearch: ({search = 'NewExpression', node }: any) => {
    // const parent = SyntaxKind[node.kind];

    forEachChild(node, (child) => {
    const kind = SyntaxKind[child.kind];
    if (kind !== search) return Ast.recursiveSearch({search, node: child});
      return forEachChild(child, (c) => c?.getText());
    });
    return undefined;
  },

  getInstantiatedClasses: (block: Block, result = []) => {
    console.log('1 block', SyntaxKind[block.kind]);
    forEachChild(block, (body) => {
      body.forEachChild((child) => {
        console.log('2 ....', SyntaxKind[child.kind]);
        if (SyntaxKind[child.kind] !== 'BinaryExpression') return result;
        forEachChild(child, (token) => {
          forEachChild(token, (_) => {
            if (SyntaxKind[token.kind] !== 'NewExpression') return result;
            // token.forEachChild((child) => result.push(child.getText()));
          });
        });
      });
    });
    return result;
  },
};

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

const [rootFile] = process.argv.slice(2);

new AnkhUml()
.parse({rootFile})
  .render({renderer: ERenderer.PlantUml, outDir: '.'});
