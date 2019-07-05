const path = require('path');

module.exports = {
  extends: 'airbnb',
  plugins: [
    "react-hooks",
  ],
  rules: {
    'import/no-extraneous-dependencies': ['error', {'devDependencies': true}],
    'import/prefer-default-export': 'off',
    'import/no-named-as-default': 0,
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/label-has-associated-control': [ 2, {
      'labelComponents': ['label'],
      'controlComponents': ['input']
    }],
     'jsx-a11y/anchor-is-valid': [ 'error', {
      'components': [ 'Link' ],
      'specialLink': [ 'hrefLeft', 'hrefRight' ],
      'aspects': [ 'noHref' ]
    }],
    'no-script-url': 'off',
    'no-underscore-dangle': 'off',
    'react/destructuring-assignment': 'off',
    'prefer-destructuring': 'off',
    'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx'] }],
    'space-before-function-paren': ['error', { 'named': 'never', 'anonymous': 'never' }],
    semi: ['error', 'never', { 'beforeStatementContinuationChars': 'always'}],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
  env: {
    browser: true,
    jest: true,
  },
  settings: {
      'import/resolver': {
        node: {
          paths: [path.resolve(__dirname, 'src')],
        },
      },
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
  },
}
