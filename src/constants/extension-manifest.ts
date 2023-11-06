// FIXME:
// "resolveJsonModule": true
// effect ts-morph output directory structure, if import package.json
// some fields is required
// https://code.visualstudio.com/api/references/extension-manifest

// output as extension's package.json
export const manifest = {
    name: 'starless-monokai',
    displayName: 'Starless Monokai',
    version: '0.1.0',
    publisher: 'izumiiAoba',
    engines: {
        vscode: '^1.57.0',
    },
};
