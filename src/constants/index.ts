import type { AnsiColor, Color, ExtensionInfo } from '../types/index.ts';

export * from './extension-manifest.ts';

export const MonokaiPro: ExtensionInfo = {
    name: 'theme-monokai-pro-vscode',
    publisher: 'monokai',
    repoName: 'monokai-pro-vscode',
    repoAuthor: 'Monokai',
};

export const OneMonokai: ExtensionInfo = {
    name: 'one-monokai',
    publisher: 'azemoh',
    repoName: 'vscode-one-monokai',
    repoAuthor: 'azemoh',
};

export const ONE_DARK_BLUE: Color = '#61afef';

export const MONOKAI_PRO_YELLOW: Color = '#ffd866';

export const TEMP_DIR_PATH = 'dist/temp';

// same as extensionDevelopmentPath in .vscode/launch.json args
export const OUTPUT_EXTENSION_DIR_PATH = 'dist/extension';

export const THEME_APPEND_CONFIG = {
    $schema: 'vscode://schemas/color-theme',
    semanticHighlighting: true,
};

export const WWDC_ANSI_COLORS: AnsiColor = {
    black: '#292C36',
    red: '#DC3C3C',
    green: '#95C76F',
    yellow: '#D28E5D',
    blue: '#8485CE',
    magenta: '#B73999',
    cyan: '#00ABA5',
    white: '#A8ABB6',
};
