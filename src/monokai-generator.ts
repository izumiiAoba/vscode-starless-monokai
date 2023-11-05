import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import stream from 'node:stream';
import streamp from 'node:stream/promises';
import fse from 'fs-extra';
import UnZipper from 'unzipper';
import type { GeneratorConfig, ThemeConfig } from './types/index.ts';
import { isLegacyThemeConfig } from './utils/theme.ts';
import { queryExtensionInfoFromMarketplace } from './utils/api.ts';

const tempDirPath = path.resolve(process.cwd(), 'dist/temp');

const createMonokaiGenerator = ({
    themeName,
    extension,
    findThemeConfigInPackage,
}: GeneratorConfig) => {
    const downloadThemePackage = async (fetchPackage: () => Promise<Response>, packageFilePath: string) => {
        // for local dev
        const isPackageCached = fs.existsSync(packageFilePath);
        if (isPackageCached)
            return;

        const response = await fetchPackage();

        if (!response.body)
            // TODO: better error description
            throw new Error('response body is empty');

        await fse.ensureDir(tempDirPath);

        // write to disk as zip extension, instead of vsix
        await streamp.pipeline(
            stream.Readable.fromWeb(response.body),
            fs.createWriteStream(packageFilePath),
        );
    };

    const formateThemeConfig = (rawConfig: Record<string, unknown>): ThemeConfig => {
        if (isLegacyThemeConfig(rawConfig)) {
            // eslint-disable-next-line no-console
            console.log('isLegacyThemeConfig');
            return {} as ThemeConfig;
        }
        return rawConfig as ThemeConfig;
    };

    const getThemeConfig = async (version: string, fetchPackage: () => Promise<Response>): Promise<ThemeConfig | void> => {
        const packageFilePath = path.resolve(
            tempDirPath,
            [...themeName, version, 'source.zip'].join('-'),
        );
        const themeConfigFilePath = path.resolve(
            tempDirPath,
            [...themeName, version, 'source.json'].join('-'),
        );

        await downloadThemePackage(fetchPackage, packageFilePath);

        // get theme json file from package.zip
        await fs.createReadStream(packageFilePath)
            .pipe(UnZipper.Parse())
            .on('entry', (entry) => {
                const fileName: string = entry.path;
                const type: 'Directory' | 'File' = entry.type;

                if (type !== 'File') {
                    entry.autodrain();
                    return;
                }
                const isThemeConfig = findThemeConfigInPackage(fileName);
                if (!isThemeConfig) {
                    entry.autodrain();
                    return;
                }

                entry.pipe(fs.createWriteStream(themeConfigFilePath));
            })
            .promise();

        // read theme json file, parse to object
        const themeConfigFileContent = await fsp.readFile(themeConfigFilePath, { encoding: 'utf-8' });
        try {
            const themeRawConfig = JSON.parse(themeConfigFileContent);
            return formateThemeConfig(themeRawConfig);
        }
        catch {
            // TODO: throw Error
        }
    };

    return {
        run: async () => {
            const extensionInfo = await queryExtensionInfoFromMarketplace(`${extension.publisher}.${extension.name}`);
            const targetExtension = extensionInfo.results
                .map(({ extensions }) => extensions)
                .flat(1)
                .find(({ extensionName }) => extensionName === extension.name);

            const latestVersionAsset = targetExtension?.versions[0];
            if (!latestVersionAsset) {
                // TODO: better error description
                throw new Error('extension not found');
            }

            const latestVersion = latestVersionAsset.version;
            const latestVersionExtensionUrl = latestVersionAsset.files.find(({ assetType }) => assetType === 'Microsoft.VisualStudio.Services.VSIXPackage')?.source;

            if (!latestVersionExtensionUrl) {
                // TODO: better error description
                throw new Error('extension url not found');
            }

            await getThemeConfig(
                latestVersion,
                async () => {
                    const response = await fetch(latestVersionExtensionUrl);

                    if (!response.ok) {
                        const { status, statusText } = response;
                        const body = await response.json();
                        // TODO: better error description
                        throw new Error(JSON.stringify({ status, statusText, body }, undefined, 4));
                    }

                    return response;
                },
            );
        },
    };
};

export default createMonokaiGenerator;
