import {
  createSourceFile,
  forEachChild,
  isClassDeclaration,
  isMethodDeclaration,
  isPropertyDeclaration,
  MethodDeclaration,
  PropertyDeclaration,
  ScriptTarget,
  SyntaxKind,
  type Node,
} from "typescript";
import { readFileSync, writeFileSync } from "fs";

interface UmlOptions {
  root: string;
  outDir?: string;
}
class Uml {
  private module;

  private options: UmlOptions;

  constructor({ root, outDir }: UmlOptions) {
    this.options = { root, outDir };
  }

  init() {
    const { root } = this.options;
    if (!root.endsWith(".ts")) throw new Error("Expected '.ts' file");

    try {
      const content = readFileSync(root, "utf8");
      const source = createSourceFile(root, content, ScriptTarget.ES2020, true);

      forEachChild(source, (node: Node) => {
        if (!isClassDeclaration(node)) return;
        const methods = node.members.filter((member) => isMethodDeclaration(member)) as MethodDeclaration[];
        const properties = node.members.filter((member) => isPropertyDeclaration(member)) as PropertyDeclaration[];

        this.module = {
          class: node,
          methods: methods.map((method) => ({
            name: method?.name?.getText(),
            private: method.modifiers.some((modifier) => modifier.kind === SyntaxKind.PrivateKeyword),
          })),
          properties: properties.map((property) => ({ name: property.name?.getText() })),
        };
      });
      return this;
    } catch (error) {
      throw new Error(error);
    }
  }

  parsePlantUml() {
    const { outDir } = this.options;
    const uml = {
      class: `class ${this.module.class.name?.getText()}\n`,
      methods: this.module.methods.map((method) => `  ${method.private ? "-" : "+"}${method.name}()\n`).join(""),
      properties: this.module.properties.map((property) => `  -${property.name}\n`).join(""),
    };
    const puml = `@startuml UML\n${uml.class}{\n${uml.properties}${uml.methods}}\n@enduml`;
    writeFileSync(`${outDir}/${this.module.class.name?.getText()}.puml`, puml);
  }
}

const argv = process.argv.slice(2);
const args = {
  root: argv[0] || "src/services/addition/reportAddition/autoManagedReportAddition.service.ts",
  outDir: argv[1] || "src/util/uml",
};
new Uml(args).init().parsePlantUml();
