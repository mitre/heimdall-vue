module.exports = {
  root: true,
  env: {
    node: true
  },
  globals: {
    "$": true,
    "jQuery": true
  },
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "@vue/eslint-config-typescript"]
  },
  rules: {
    'no-console': 0,
	  'name-property-casing': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  plugins: ['vue'],
  
  extends: [
    'plugin:vue/essential'
  ],
};
