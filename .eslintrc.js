const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'),
);

module.exports = {
  extends: ['react-app', 'prettier', 'plugin:react-hooks/recommended'],
  plugins: ['prettier'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    'array-callback-return': 'error',
    'no-template-curly-in-string': 'off',
    'prettier/prettier': ['error', prettierOptions],
    'no-restricted-globals': 'off',
  },
  globals: {
    __COMMIT__: true,
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: { 'prettier/prettier': ['warn', prettierOptions] },
    },
  ],
};
