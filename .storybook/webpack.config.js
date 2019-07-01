const vueConfig = require('@vue/cli-service/webpack.config.js');

module.exports = async  ({ config }) => {
  return {
    ...config,
    resolve: {
      ...vueConfig.resolve,
      extensions: ['.js', '.vue', '.json'],	 
      alias: {
        ...vueConfig.resolve.alias,
        'vue$': 'vue/dist/vue.esm.js', // if you need it

      },
    },
    module: {
      ...vueConfig.module,
      rules: vueConfig.module.rules,
    },
  }
}

// load the default config generator.
//const genDefaultConfig = require('@vue/cli-service/webpack.config.js');
//
//module.exports = (baseConfig, env) => {
//  const config = genDefaultConfig(baseConfig, env);
//
//  // Extend it as you need.
//  function resolve(dir) {
//    return path.join(__dirname, '..', dir);
//  }
//
//  config.resolve = {
//    extensions: ['.js', '.vue', '.json'],
//    alias: {
//      vue$: 'vue/dist/vue.esm.js',
//      '@': resolve('src'),
//    },
//  };
//
//  return config;
//};

