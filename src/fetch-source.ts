import { REPO_RAW_URL, SourceExtension } from './constants/index.ts';

const fetchChangeLog = async () => {
    const response = await fetch(
        `https//${REPO_RAW_URL}/${SourceExtension.REPO_AUTHOR}/${SourceExtension.REPO_NAME}/${SourceExtension.CHANGELOG_URL}`,
    );

    // DEBUG:
    // eslint-disable-next-line no-console
    console.log(response);
};

// TODO:
// marketplace.visualstudio.com/_apis/public/gallery/publishers/monokai/vsextensions/theme-monokai-pro-vscode/1.2.1/vspackage
// const fetchPackage = async () => {
// };

export const fetchSourceExtension = async () => {
    fetchChangeLog();
};
