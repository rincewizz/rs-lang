const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { merge } = require('webpack-merge');
const Dotenv = require('dotenv-webpack');

const baseConfig = module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  optimization: {
    usedExports: true
  },
  entry: './index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js',
    clean: true,
    publicPath: '/'
  },
  resolve: {
    extensions: ['.tsx','.ts', '.jsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },

        {
          test: /\.(scss|css)$/,
          use: [
            'style-loader',
            { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
            { loader: 'postcss-loader', options: { sourceMap: true } },
            { loader: 'sass-loader', options: { sourceMap: true } },
          ],
        },

        { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },

        { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline' },
        {
          test: /\.json/,
          type: 'asset/resource',
          generator: {
            filename: 'products/[name][ext]',
          },
        },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({ patterns: [
      { from: './assets/img', to: 'img', noErrorOnMissing: true, },
      { from: './assets/fonts', to: 'fonts', noErrorOnMissing: true, }
    ] }), 
    new ESLintPlugin({
      extensions: ["js", "jsx", "ts", "tsx"],
      exclude: 'node_modules'
    }),
    new Dotenv(),
  ],
  };

module.exports = ({ mode }) => {
  const isProductionMode = mode === 'prod';
  const envConfig = isProductionMode ? require('./webpack.prod.config') : require('./webpack.dev.config');

  return merge(baseConfig, envConfig);
};
