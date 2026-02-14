module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: ['.tsx', '.ts', '.png', '.json'],
        alias: {
          '@': './src',
          '@images': './assets/images',
        },
      },
    ],
  ],
};
