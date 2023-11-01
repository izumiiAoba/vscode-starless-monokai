// Copy from: https://github.com/microsoft/vscode/blob/main/src/vs/workbench/services/themes/common/workbenchThemeService.ts
export type TokenColorizationSetting = {
    foreground?: string;
    background?: string;
    fontStyle?: string; /* [italic|bold|underline|strikethrough] */
};

// Copy from: https://github.com/microsoft/vscode/blob/main/src/vs/workbench/services/themes/common/workbenchThemeService.ts
export type TextMateThemingRule = {
    name?: string;
    scope?: string | string[];
    settings: TokenColorizationSetting;
};
