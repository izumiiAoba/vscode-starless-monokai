import { MonokaiPro, OneMonokai } from './constants/index.ts';
import createMonokaiGenerator from './monokai-generator.ts';
import { setFetchProxy } from './utils/proxy.ts';

// NOTE: if necessary
setFetchProxy('http://127.0.0.1:7890');

(async () => {
    try {
        createMonokaiGenerator({
            themeName: ['starless', 'monokai', 'pro'],
            extension: MonokaiPro,
            findThemeConfigInPackage: filePath => filePath === 'extension/themes/Monokai Pro.json',
        }).run();

        createMonokaiGenerator({
            themeName: ['starless', 'monokai', 'one'],
            extension: OneMonokai,
            findThemeConfigInPackage: filePath => filePath === 'extension/themes/OneMonokai-color-theme.json',
        }).run();
    }
    catch (error) {
        // DEBUG:
        // eslint-disable-next-line no-console
        console.log(error);
    }
})();
