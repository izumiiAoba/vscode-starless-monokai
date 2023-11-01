import type { OverrideProperties } from 'type-fest';
import type { TextMateThemingRule, TokenColorizationSetting } from './vscode.ts';

export type ThemeConfig = {
    name: string;
    type: string;
    colorSpaceName: string;
    colors: Record<string, `#{string}`>;
    tokenColors: TextMateThemingRule[];
    [prop: string]: unknown;
};

export type LegacyThemeConfig = OverrideProperties<
    ThemeConfig,
    {
        tokenColors: (Pick<TextMateThemingRule, 'scope'> & {
            settings: TokenColorizationSetting & {
                name?: string;
                Name?: string;
            };
        })[];
    }
>;
