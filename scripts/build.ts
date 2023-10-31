import { Project, ScriptTarget } from 'ts-morph';

const project = new Project({
    compilerOptions: {
        tsConfigFilePath: '../tsconfig.json', // project's root
        target: ScriptTarget.ES2022,
    },
});

project
    .getSourceFiles()
    .forEach((sourceFile) => {
        const importDeclarations = sourceFile.getImportDeclarations();
        importDeclarations.forEach((i) => {
            const importPath = i.getModuleSpecifier();
        });
    });

project
    .emit()
    .then(result => result.getDiagnostics());
