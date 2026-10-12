import ts from 'typescript-eslint';import globals from 'globals';
export default ts.config(...ts.configs.recommended,{languageOptions:{globals:{...globals.node,...globals.browser}},rules:{'@typescript-eslint/no-unused-vars':['error',{argsIgnorePattern:'^_'}]}});
