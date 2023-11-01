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
            // FIXME: output file is commonjs, even if module: node16
            // module: ModuleKind.Node16,
            // moduleResolution: ModuleResolutionKind.Node16,
            module: ModuleKind.ES2022,
            moduleResolution: ModuleResolutionKind.Bundler,
            target: ScriptTarget.ES2020,
            strict: true,
            noImplicitReturns: true,
            noFallthroughCasesInSwitch: true,
            noUnusedParameters: true,
            lib: ['lib.es2022.d.ts'], // corresponding file in node_modules/typescript/lib, use `es2022` will cause resolve error
        },
    });
    // DEBUG: Project doesn't resolve and add source files in construction, due to tsConfig load
    project.addSourceFilesAtPaths(path.resolve(rootPath, './src/**/*'));
    // manipulate import's module file extension
    // this build script aim to substitute `.ts` file import specifier to `.js`, which isn't allow in module: node16
    // thus, manipulate before pre-emit compile check
    project
        .getSourceFiles()
        .forEach((sourceFile) => {
        // import
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
        // export
        const exportDeclarations = sourceFile.getExportDeclarations();
        exportDeclarations.forEach((declaration) => {
            const exportPathLiteral = declaration.getModuleSpecifier();
            if (!exportPathLiteral)
                return;
            const exportPath = exportPathLiteral.getLiteralValue();
            const matchResult = exportPath.match(/^((\.|\.\.)\/.+)\.ts$/);
            if (!matchResult)
                return;
            const convertedPath = `${matchResult[1]}.js`;
            exportPathLiteral.setLiteralValue(convertedPath);
        });
    });
    // pre-emit diagnostics
    const diagnostics = project.getPreEmitDiagnostics();
    if (diagnostics.length !== 0) {
        console.log(project.formatDiagnosticsWithColorAndContext(diagnostics));
        console.error(chalk.red('[ts-morph] Compiling Failed (pre-emit)'));
        return;
    }
    // emit js files
    const emitResult = await project.emit();
    if (emitResult.getEmitSkipped()) {
        console.log(project.formatDiagnosticsWithColorAndContext(emitResult.getDiagnostics()));
        console.error(chalk.red('[ts-morph] Compiling Failed'));
        return;
    }
    console.log(chalk.green('[ts-morph] Compiling Finished'));
})();
