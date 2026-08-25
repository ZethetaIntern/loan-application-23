module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
    project: './tsconfig.json',
  },
  plugins: ['jsx-a11y'],
  settings: {
    import/resolver: { typescript: { alwaysTryTypes: true } },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
  ignorePatterns: ['dist', 'coverage', 'node_modules', 'e2e', '*.cjs', 'vite.config.ts', 'vitest.config.ts', 'playwright.config.ts'],
}
