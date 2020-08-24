module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@models': './src/models',
          '@entities': './src/entities',
          '@controllers': './src/controllers',
          '@middlewares': './src/middlewares',
          '@schemas': './src/schemas',
        },
      },
    ],
  ],
  ignore: ['**/*.spec.ts'],
};
