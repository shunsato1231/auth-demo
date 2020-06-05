import * as webpack from "webpack"
import * as path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const src  = path.resolve(__dirname, 'src')
const dist = path.resolve(__dirname, 'dist')

const config: webpack.Configuration = {
  entry: src + '/index.tsx',
  output: {
    path: dist,
    publicPath: '/',
    filename: 'bundle.js?[hash]'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {loader: 'ts-loader'}
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: src + '/index.html',
      filename: 'index.html'
    })
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: dist,
    host: '0.0.0.0'
  }
}

export default config