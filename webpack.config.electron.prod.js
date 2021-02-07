const path = require('path');

const outPath = path.resolve(__dirname, 'dist-electron');

module.exports = {
  entry: './src/electron/main.ts',
  output: {
    filename: 'electron.main.bundle.js',
    path: outPath,
  },
  target: 'electron-main',
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [  ],
};
