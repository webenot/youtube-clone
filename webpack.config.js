require('@babel/polyfill');
const path = require('path');

const MODE = process.env.WEBPACK_ENV;
const ENTRY_FILE = path.resolve(__dirname, 'assets', 'js', 'main.js');
const OUTPUT_DIR = path.join(__dirname, 'public', 'javascript');

const config = {
  entry: [ '@babel/polyfill', ENTRY_FILE ],
  output: {
    path: OUTPUT_DIR,
  },
  mode: MODE,
  module: {
    rules: [
      {
        test: /\.m?jsx?$/i,
        exclude: /^(node_modules)$/,
        use: {
          loader: 'babel-loader',
          options: {
            configFile: './babel.config.js',
            cacheDirectory: true,
          },
        },
      },
    ],
  },
};

module.exports = config;
