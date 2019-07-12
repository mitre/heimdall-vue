module.exports = {
  presets: [
    ['@babel/preset-typescript', {
      'allExtensions': true
    }],
    '@vue/app'
  ],
  plugins: [
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    // '@babel/plugin-proposal-decorators'
  ]
}
