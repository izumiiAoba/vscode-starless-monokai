import path from 'node:path';
import process from 'node:process';
import fse from 'fs-extra';
import {
    MANIFEST_SOURCES_KEY,
    MONOKAI_PRO_YELLOW,
    MonokaiPro,
    ONE_DARK_BLUE,
    OUTPUT_EXTENSION_DIR_PATH,
    OneMonokai,
    manifest,
} from './constants/index.ts';
import createMonokaiGenerator from './monokai-generator.ts';
import { setFetchProxy } from './utils/index.ts';

// NOTE: if necessary
setFetchProxy('http://127.0.0.1:7890');

(async () => {
    try {
        const themeGenerateResults = await Promise.all([
            createMonokaiGenerator({
                themeName: ['starless', 'monokai', 'pro'],
                extension: MonokaiPro,
                findThemeConfigInPackage: filePath => filePath === 'extension/themes/Monokai Pro.json',
                presetAnsiColors: {
                    black: '#403e41',
                    blue: ONE_DARK_BLUE,
                    cyan: '#78dce8',
                    green: '#a9dc76',
                    magenta: '#ab9df2',
                    red: '#ff6188',
                    white: '#d7dae0',
                    yellow: '#fc9867',
                },
                preprocessThemeConfig: (config) => {
                    config.tokenColors.forEach((token) => {
                        if (token.settings.foreground === MONOKAI_PRO_YELLOW)
                            token.settings.foreground = ONE_DARK_BLUE;
                    });
                    return config;
                },
            }),
            createMonokaiGenerator({
                themeName: ['starless', 'monokai', 'one'],
                extension: OneMonokai,
                findThemeConfigInPackage: filePath => filePath === 'extension/themes/OneMonokai-color-theme.json',
                presetAnsiColors: {
                    black: '#2d3139',
                    blue: '#61afef',
                    green: '#98c379',
                    yellow: '#e5c07b',
                    cyan: '#56b6c2',
                    magenta: '#c678dd',
                    red: '#e06c75',
                    white: '#abb2bf',
                },
            }),
        ].map(generator => generator.run()));

        const themes = themeGenerateResults.filter(
            (theme): theme is NonNullable<Awaited<ReturnType<ReturnType<typeof createMonokaiGenerator>['run']>>> => !!theme,
        );

        // output
        await fse.emptyDir(
            path.resolve(process.cwd(), OUTPUT_EXTENSION_DIR_PATH),
        );

        // output package.json
        const packageJson = {
            ...manifest,
            contributes: {
                // TODO: better vscode extension manifest type
                themes: [] as Record<string, unknown>[],
            },
            [MANIFEST_SOURCES_KEY]: themes.map(({ sourceExtension }) => {
                const { publisher, versions, extensionName } = sourceExtension;
                const { publisherName } = publisher;
                const latestVersion = versions[0].version;
                return [
                    `${publisherName}.${extensionName}`,
                    latestVersion,
                ];
            }),
        };
        themes.forEach((theme) => {
            packageJson.contributes.themes.push({
                label: theme.themeConfig.name,
                uiTheme: 'vs-dark',
                path: `./themes/${theme.fileName}`,
            });
        });
        await fse.writeJSON(
            path.resolve(process.cwd(), OUTPUT_EXTENSION_DIR_PATH, 'package.json'),
            packageJson,
            { spaces: 4 },
        );

        // output themes
        await fse.emptyDir(
            path.resolve(process.cwd(), OUTPUT_EXTENSION_DIR_PATH, 'themes'),
        );
        await Promise.all(
            themes.map(({ fileName, themeConfig }) => fse.writeJSON(
                path.resolve(
                    process.cwd(),
                    OUTPUT_EXTENSION_DIR_PATH,
                    'themes',
                    fileName,
                ),
                themeConfig,
                { spaces: 4 },
            )),
        );
    }
    catch (error) {
        // DEBUG:
        // eslint-disable-next-line no-console
        console.log(error);
    }
})();
