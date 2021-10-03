import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const app = path.resolve(__dirname, 'app');
const dist = path.resolve(__dirname, 'dist');

const config = {
  entry: app + '/index.tsx',
  output: {
    path: dist,
    publicPath: '/',
    filename: 'bundle.js?[hash]',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [{ loader: 'babel-loader' }, { loader: 'ts-loader' }],
      },
      {
        test: /\.styl$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-modules-typescript-loader' },
          { loader: 'css-loader', options: { modules: true } },
          { loader: 'stylus-loader' },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: app + '/index.html',
      filename: 'index.html',
    }),
  ],
  devServer: {
    historyApiFallback: true,
    static: {
      directory: dist,
    },
    host: '0.0.0.0',
    port: 3000,
  },
};

module.exports = config;
