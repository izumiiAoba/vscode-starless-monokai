export * from './vscode.ts';
export * from './theme.ts';

export type Version = [major: number, minor: number, patch: number];

export type ExtensionInfo = {
    name: string;
    publisher: string;
    repoName: string;
    repoAuthor: string;
};

export type GeneratorConfig = {
    themeName: Lowercase<string>[];
    extension: ExtensionInfo;
    fetchVersions: () => Promise<Version[]>;
    fetchPackage: (version: Version) => Promise<Response>;
    findThemeConfigInPackage: (filePath: string) => boolean;
};
