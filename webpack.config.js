const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './app.js', // Entry point của ứng dụng
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js' // Tên file bundle được tạo ra
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
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
