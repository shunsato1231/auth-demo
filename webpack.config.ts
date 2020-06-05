const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const src  = path.resolve(__dirname, 'src')
const dist = path.resolve(__dirname, 'dist')

const config = {
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
          {loader: 'babel-loader'},
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

module.exports = config