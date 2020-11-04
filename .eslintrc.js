/*
 * @Author: your name
 * @Date: 2020-08-10 13:17:13
 * @LastEditTime: 2020-08-11 10:46:25
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \DDcodeSchool\.eslintrc.js
 */
const path = require('path');
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['prettier/@typescript-eslint'],
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import', 'jsx-a11y', 'html', 'prettier'],
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true
  },
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
    UMI_API_BASE: true,
    UMI_ENV: true,
    UMI_OS_ADDR: true
  },
  parserOptions: {
    // 支持最新 JavaScript
    project: path.resolve(__dirname, './tsconfig.json'),
    tsconfigRootDir: __dirname,
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true // Allows for the parsing of JSX
    }
  },
  rules: {
    'prettier/prettier': 'error'
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect'
    }
  }
};
