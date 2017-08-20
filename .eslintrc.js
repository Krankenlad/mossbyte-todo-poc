var path = require('path');

module.exports = {
    extends: [
        'airbnb-base',
        'plugin:fetch/recommended',
    ],
    parser: 'babel-eslint',
    settings: {
        'import/resolver': 'node',
    },
    globals: {
        fetch: false,
    },
    env: {
        jest: true,
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error',
        indent: [
            'error',
            4,
        ],
        'linebreak-style': 'off',
        'import/prefer-default-export': 'off',
        'class-methods-use-this': 'off',
        'max-len': [
            'error',
            150,
        ],
        'no-bitwise': 'off',
        'arrow-body-style': 'off',
        'no-param-reassign': 'off',
    },
    plugins: [
        'react',
        'fetch',
    ],
};
