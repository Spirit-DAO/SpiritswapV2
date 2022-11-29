module.exports = api => {
  // This caches the Babel config for faster rebuilds
  api.cache.using(() => process.env.NODE_ENV);

  return {
    presets: [['babel-preset-react-app', { runtime: 'automatic' }]],
    plugins: [
      ['macros'],
      ['@babel/plugin-transform-runtime'],
      [
        'babel-plugin-styled-components',
        {
          ssr: false,
          minify: true,
          transpileTemplateLiterals: true,
          pure: false,
          displayName: false,
          fileName: false,
          preprocess: false,
        },
      ],
      [
        'module-resolver',
        {
          alias: {
            theme: './src/theme',
            components: './src/components',
            config: './src/config',
            utils: './src/utils',
            assets: './src/assets',
            store: './src/store',
            routes: './src/routes',
            contexts: './src/contexts',
            hooks: './src/hooks',
            constants: './src/constants',
            app: './src/app',
            pages: './src/app/pages',
          },
        },
      ],
    ],
  };
};
