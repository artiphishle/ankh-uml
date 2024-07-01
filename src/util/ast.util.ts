import {
  Block,
  ClassElement,
  forEachChild,
  isConstructorDeclaration,
  isImportDeclaration,
  isMethodDeclaration,
  isPropertyDeclaration,
  isNamespaceImport,
  NodeArray,
  ParameterDeclaration,
  SyntaxKind,
  type MethodDeclaration,
  type Node,
  type PropertyDeclaration,
} from 'typescript';

export const Ast = {
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