import { REPO_RAW_URL, SourceExtension } from './constants/index.ts';

const fetchChangeLog = async () => {
    // TODO: 给 node 脚本设置代理
    const response = await fetch(
        `https://${REPO_RAW_URL}/${SourceExtension.REPO_AUTHOR}/${SourceExtension.REPO_NAME}/${SourceExtension.CHANGELOG_URL}`,
    );

    const changelog = await response.text();

    // DEBUG:
    // eslint-disable-next-line no-console
    console.log(changelog);
};

// TODO:
// marketplace.visualstudio.com/_apis/public/gallery/publishers/monokai/vsextensions/theme-monokai-pro-vscode/1.2.1/vspackage
// const fetchPackage = async () => {
// };

export const fetchSourceExtension = async () => {
    fetchChangeLog();
};
