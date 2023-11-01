import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import stream from 'node:stream';
import streamp from 'node:stream/promises';
import fse from 'fs-extra';
import UnZipper from 'unzipper';
import type { GeneratorConfig, ThemeConfig, Version } from './types/index.ts';
import { isLegacyThemeConfig } from './utils/theme.ts';

const tempDirPath = path.resolve(process.cwd(), 'dist/temp');

const createMonokaiGenerator = ({
    themeName,
    fetchVersions,
    fetchPackage,
    findThemeConfigInPackage,
}: GeneratorConfig) => {
    const downloadThemePackage = async (version: Version, packageFilePath: string) => {
        // for local dev
        const isPackageCached = fs.existsSync(packageFilePath);
        if (isPackageCached)
            return;

        const response = await fetchPackage(version);

        if (!response.ok) {
            const { status, statusText } = response;
            /**
             * @example
             * ```json
             * {
             *   "$id": "1",
             *   "innerException": null,
             *   "message": "Request was blocked due to exceeding usage of resource 'Count' in namespace 'AnonymousId'. For more information on why your request was blocked, see the topic \"Rate limits\" on the Microsoft Web site (https://go.microsoft.com/fwlink/?LinkId=823950).",
             *   "typeName": "Microsoft.TeamFoundation.Framework.Server.RequestBlockedException, Microsoft.TeamFoundation.Framework.Server",
             *   "typeKey": "RequestBlockedException",
             *   "errorCode": 0,
             *   "eventId": 3000
             * }
             * ```
             */
            const body = await response.json();
            // TODO: better error description
            throw new Error(JSON.stringify({ status, statusText, body }, undefined, 4));
        }

        if (!response.body)
            // TODO: better error description
            throw new Error('response body is empty');

        await fse.emptyDir(tempDirPath);

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

    const getThemeConfig = async (): Promise<ThemeConfig | void> => {
        const versions = await fetchVersions();
        const latestVersion = versions[0];

        const packageFilePath = path.resolve(
            tempDirPath,
            [...themeName, latestVersion.join('.'), 'source.zip'].join('-'),
        );

        const themeConfigFilePath = path.resolve(
            tempDirPath,
            [...themeName, latestVersion.join('.'), 'source.json'].join('-'),
        );

        await downloadThemePackage(latestVersion, packageFilePath);

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
            getThemeConfig();
        },
    };
};

export default createMonokaiGenerator;
