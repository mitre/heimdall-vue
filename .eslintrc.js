module.exports = {
  globals: {
    "$": true,
    "jQuery": true
  },
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: true,
  },
  rules: {
    'no-console': 0,
  },
  plugins: ['vue'],
  
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:vue/recommended'
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
  }
};
