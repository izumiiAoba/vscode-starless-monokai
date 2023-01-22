import eslint from '@antfu/eslint-config';

export default eslint(
    {
        stylistic: {
            indent: 4,
        },
    },
    {
        rules: {
            'style/semi': ['error', 'always'],
        },
    },
    {
        files: ['**/*.ts'],
        rules: {
            'ts/consistent-type-definitions': ['error', 'type'],
            'style/member-delimiter-style': [
                'error',
                {
                    multiline: {
                        delimiter: 'semi',
                        requireLast: true,
                    },
                    singleline: {
                        delimiter: 'semi',
                        requireLast: false,
                    },
                    multilineDetection: 'brackets',
                },
            ],
        },
    },
);
