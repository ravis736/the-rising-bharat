module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['react-app'],
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    'react/jsx-props-no-spreading': 'off',
    'no-unused-vars': 'warn',
  },
};
