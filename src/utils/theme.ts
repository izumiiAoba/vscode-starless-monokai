import type { OverrideProperties } from 'type-fest';
import type { LegacyThemeConfig, ThemeConfig } from '../types/index.ts';

export const isLegacyThemeConfig = (
    themeConfigLike: Record<string, any>,
): themeConfigLike is LegacyThemeConfig => {
    return Array.isArray(themeConfigLike.tokenColors) && themeConfigLike.tokenColors.some((token) => {
        return !token.name && token.settings.name;
    });
};
