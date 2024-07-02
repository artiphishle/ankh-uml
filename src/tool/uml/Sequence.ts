import {
  createSourceFile,
  isClassDeclaration,
  forEachChild,
  ScriptTarget,
  type Node
} from "typescript";
import {Ast} from "src/util/ast.util";
import {readSync} from "src/util/fs.util";

export class Sequence {
  constructor(){
    console.log("SEQUENCE DIAGRAM\n\n");
  }
  
  // TODO extract common code of UML/Sequence
  parse(rootFile: string){
    const content = readSync(rootFile);
    const ast = createSourceFile(rootFile, content, ScriptTarget.ES2020, true);
    
    forEachChild(ast, (n: Node) => {
      if(!isClassDeclaration(n)) return;
      
      const methods = Ast.getMethods(n.members);
      const props = Ast.getProperties(n.members);
      
      const m = Ast.getMethodJson(methods);
      const p = Ast.getPropertiesJson(props);
      
      p.map((pp: any) => {
        console.log("Prop:", pp.name);
        return pp
      });
      
      m.map((pp: any) => {
        console.log("Method: ", pp.name);
        return pp
      });
      
      console.log("\n", "🚧 WIP");
      
    });
  }
}