import ColorConvert from 'color';
import type { Color } from '../types/index.ts';

export const brighter = (inputColor: Color): Color => {
    const brighterColor = ColorConvert(inputColor).saturate(0.1).lighten(0.1);

    return brighterColor.hex() as Color;
};

export const darker = (inputColor: Color): Color => {
    const darkerColor = ColorConvert(inputColor).desaturate(0.1).darken(0.1);

    return darkerColor.hex() as Color;
};
