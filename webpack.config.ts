import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import DotenvWebpack from 'dotenv-webpack';
import WorkboxPlugin from 'workbox-webpack-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';

const src = path.resolve(__dirname, 'frontend');
const dist = path.resolve(__dirname, 'dist');

const config = {
  entry: src + '/index.tsx',
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
    plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
    alias: {
      '~': src,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: src + '/index.html',
      filename: 'index.html',
    }),
    new WorkboxPlugin.InjectManifest({
      maximumFileSizeToCacheInBytes: 1024 * 1024 * 5,
      swSrc: src + '/service-worker.ts',
      swDest: 'service-worker.js',
    }),
    new DotenvWebpack(),
  ],
  devServer: {
    historyApiFallback: true,
    static: {
      directory: dist,
    },
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // local api server
        pathRewrite: { '^/api': '' }, // rewrite
      },
    },
  },
};

module.exports = config;
