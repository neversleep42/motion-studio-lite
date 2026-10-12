import ts from 'typescript';
export function validateCode(value:unknown):string {
 if(typeof value!=='string'||!value.trim()||value.length>40000)throw Error('Le code doit contenir entre 1 et 40 000 caractères.');
 const ast=ts.createSourceFile('Composition.tsx',value,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 function visit(n:ts.Node){
  if((ts.isImportDeclaration(n)||ts.isExportDeclaration(n))&&n.moduleSpecifier){if(!ts.isStringLiteral(n.moduleSpecifier)||!['react','react/jsx-runtime','remotion'].includes(n.moduleSpecifier.text))throw Error('Imports autorisés : react et remotion uniquement.');}
  if(ts.isCallExpression(n)&&(n.expression.kind===ts.SyntaxKind.ImportKeyword||(ts.isIdentifier(n.expression)&&n.expression.text==='require')))throw Error('Les imports dynamiques ne sont pas disponibles.');
  ts.forEachChild(n,visit);
 }visit(ast);return value;
}
export const validId=(id:unknown):id is string=>typeof id==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id);
