import path from 'node:path';
import url from 'node:url';
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from 'ts-morph';
import chalk from 'chalk';
(async () => {
    console.log(chalk.blue('[ts-morph] Start Compiling'));
    // project root
    const rootPath = url.fileURLToPath(new URL('../../', import.meta.url));
    // initial project with config
    const project = new Project({
        compilerOptions: {
            // FIXME: not load config successfully
            tsConfigFilePath: path.resolve(rootPath, './tsconfig.json'),
            outDir: path.resolve(rootPath, './dist/script'),
            // DEBUG: copy config from root's tsconfig.json
            module: ModuleKind.Node16,
            moduleResolution: ModuleResolutionKind.Node16,
            noEmit: true,
            allowImportingTsExtensions: true,
            target: ScriptTarget.ES2022,
            strict: true,
            noImplicitReturns: true,
            noFallthroughCasesInSwitch: true,
            noUnusedParameters: true,
            // lib: ['es2022'],
        },
    });
    // DEBUG: Project doesn't resolve and add source files in construction, due to tsConfig load
    project.addSourceFilesAtPaths(path.resolve(rootPath, './src/**/*'));
    // pre-emit diagnostics
    const diagnostics = project.getPreEmitDiagnostics();
    if (diagnostics.length !== 0) {
        console.log(project.formatDiagnosticsWithColorAndContext(diagnostics));
        console.error(chalk.red('[ts-morph] Compiling Failed (pre-emit)'));
        return;
    }
    // manipulate import's module file extension
    project
        .getSourceFiles()
        .forEach((sourceFile) => {
        const importDeclarations = sourceFile.getImportDeclarations();
        importDeclarations.forEach((declaration) => {
            const importPathLiteral = declaration.getModuleSpecifier();
            const importPath = importPathLiteral.getLiteralValue();
            const matchResult = importPath.match(/^((\.|\.\.)\/.+)\.ts$/);
            if (!matchResult)
                return;
            const convertedPath = `${matchResult[1]}.js`;
            importPathLiteral.setLiteralValue(convertedPath);
        });
    });
    // emit js files
    const emitResult = await project.emit();
    if (emitResult.getEmitSkipped()) {
        console.log(project.formatDiagnosticsWithColorAndContext(emitResult.getDiagnostics()));
        console.error(chalk.red('[ts-morph] Compiling Failed'));
    }
    console.log(chalk.green('[ts-morph] Compiling Finished'));
})();
