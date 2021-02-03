const path = require('path');
const spawn = require('cross-spawn');

const outPath = path.resolve(__dirname, '../', 'dist-electron');

class InvokeElectronWebpackPlugin {
  constructor() {
    this.runProcess = null;
  }

  apply(compiler) {
    compiler.hooks.done.tap('InvokeElectronWebpackPlugin', () => {
      if (this.runProcess) {
        // FIXME: 如何解决只关闭子进程而不关闭父进程呢？
      }
      // TODO: 去掉 outPath
      this.runProcess = spawn(
        'npx',
        ['electron', path.resolve(outPath, 'electron.main.bundle.js')],
        {
          shell: true,
          env: process.env,
          stdio: 'inherit',
        },
      );
      this.runProcess
        .on('close', process.exit)
        .on('error', spawnError => console.error(spawnError));
    });
  }
}

module.exports = {
  entry: './src/electron/main.ts',
  output: {
    filename: 'electron.main.bundle.js',
    path: outPath,
  },
  target: 'electron-main',
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
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
  plugins: [
    new InvokeElectronWebpackPlugin(),
  ],
};
