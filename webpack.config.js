const dotEnvFlow = require('dotenv-flow');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { DefinePlugin } = require('webpack');
const Handlebars = require('handlebars');
const pkg = require('./package.json');

dotEnvFlow.config();

const { paths } = require('./utils/paths');
const { isDev, isProd, mode } = require('./utils/mode');

module.exports = {
  mode,
  target: isDev ? 'web' : 'browserslist',
  devtool: isDev && 'inline-source-map',
  entry: {
    app: paths.appEntry,
  },
  output: {
    filename: isDev ? '[name].js' : 'js/[name].[contenthash:6].js',
    path: paths.appBuild,
    clean: isProd,
    assetModuleFilename: '[name][ext]',
  },
  devServer: {
    port: 3000,
    hot: true,
    compress: true,
    open: false,
    watchFiles: ['src/**/*.html'],
    historyApiFallback: true,
  },
  optimization: {
    minimize: isProd,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
      }),
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': paths.appSrc,
      '~': `${paths.appRoot}/node_modules`,
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                isDev && 'react-refresh/babel',
              ].filter(Boolean),
            },
          },
        ],
      },
      {
        test: /\.(css|scss)$/i,
        exclude: /\.module\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          isProd && 'postcss-loader',
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ].filter(Boolean),
      },
      {
        test: /\.module\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              esModule: true,
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
            },
          },
          isProd && 'postcss-loader',
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ].filter(Boolean),
      },
      {
        test: /\.(png|svg|jpe?g|gif|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name].[contenthash:6][ext][query]',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 1024 * 5,
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[contenthash:6][ext][query]',
        },
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          preprocessor: async (content, loaderContext) => {
            let res;

            try {
              res = await Handlebars.compile(content)({
                pkg,
                env: process.env,
              });
            } catch (err) {
              await loaderContext.emitError(err);

              return content;
            }

            return res;
          },
        },
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
    new MiniCssExtractPlugin({
      filename: isDev ? '[name].css' : 'css/[name].[contenthash:6].css',
    }),
    new HtmlWebpackPlugin({
      template: paths.appHtml,
      inject: 'body',
      minify: isProd,
      favicon: `${paths.appPublic}/favicon.ico`,
    }),
    isDev && new ReactRefreshWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [{ from: paths.appPublic, to: paths.appBuild }],
    }),
    new ForkTsCheckerWebpackPlugin(),
  ].filter(Boolean),
};
