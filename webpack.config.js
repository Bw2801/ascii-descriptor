const path = require('path');

const clientConfig = {
  target: 'web',
  entry: './src/index.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'unicode-descriptor.js',
    libraryTarget: 'var',
    library: 'UnicodeDescriptor'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};

module.exports = [ clientConfig ]
