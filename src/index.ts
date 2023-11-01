import { MonokaiPro, REPO_RAW_URL } from './constants/index.ts';
import createMonokaiGenerator from './monokai-generator.ts';
import type { Version } from './types/index.ts';
import { setFetchProxy } from './utils/proxy.ts';

// NOTE: if necessary
// setFetchProxy('http://127.0.0.1:7890');

(async () => {
    try {
        createMonokaiGenerator({
            themeName: ['starless', 'monokai', 'pro'],
            extension: MonokaiPro,
            fetchVersions: async () => {
                const response = await fetch(
                    `https://${REPO_RAW_URL}/${MonokaiPro.repoAuthor}/${MonokaiPro.repoName}/master/CHANGELOG.md`,
                );
                const changelogContent = await response.text();

                const matchResults = changelogContent.matchAll(/^#+\s(\d+\.\d+.\d+)/gm);
                const versions: Version[] = Array.from(matchResults)
                    .map(match => match[1])
                    .map((versionText) => {
                        const [major, minor, patch] = versionText.split('.');
                        return [Number.parseInt(major), Number.parseInt(minor), Number.parseInt(patch)];
                    });

                return versions;
            },
            fetchPackage: async (extensionVersion) => {
                const version = extensionVersion.join('.');

                const response = await fetch(
                    [
                        'https://marketplace.visualstudio.com',
                        '_apis',
                        'public',
                        'gallery',
                        'publishers',
                        MonokaiPro.publisher,
                        'vsextensions',
                        MonokaiPro.name,
                        version,
                        'vspackage',
                    ].join('/'),
                );

                return response;
            },
            findThemeConfigInPackage: filePath => filePath === 'extension/themes/Monokai Pro.json',
        }).run();
    }
    catch (error) {
        // DEBUG:
        // eslint-disable-next-line no-console
        console.log(error);
    }
})();
