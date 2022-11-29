import path from 'path';
import {
  Configuration,
  ProvidePlugin,
  IgnorePlugin,
  DefinePlugin,
} from 'webpack';
import * as webpackDevServer from 'webpack-dev-server';

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

let commitHash: string = '';

try {
  commitHash = require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString()
    .trim();
} catch (error) {
  commitHash = '';
}

const config = (env): Configuration => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    target: ['browserslist'],
    output: {
      assetModuleFilename: 'images/[hash][ext][query]',
      chunkFilename: '[name]-[chunkhash].js',
      filename: '[name]-[fullhash].js',
      path: path.resolve(__dirname, 'build'),
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        // Expose images
        {
          test: /\.(png|webm|jpe?g|gif)$/i,
          type: 'asset/resource',
        },
        // Properly load our SVG files into react components
        {
          test: /\.svg$/,
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                prettier: false,
                svgo: false,
                svgoConfig: {
                  plugins: [{ removeViewBox: false }],
                },
                titleProp: true,
                ref: true,
              },
            },
            {
              loader: 'file-loader',
              options: {
                name: 'images/[name].[hash].[ext]',
              },
            },
          ],
          issuer: {
            and: [/\.(js|ts)x?$/],
          },
        },
      ],
    },
    plugins: [
      // Which html file to use for the main page
      new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico',
        inject: true,
      }),
      new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
      // Ensure the app has the globals it needs
      new ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
      // Type checking
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          build: true,
        },
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'public/images/',
            to: 'images/',
          },
        ],
      }),
      // Moment adds a lot of locale files we don't need
      new IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        __COMMIT__: JSON.stringify(commitHash),
      }),
      // Only use HMR on dev environment
      !isProduction &&
        new ReactRefreshWebpackPlugin({
          overlay: false,
        }),
    ].filter(Boolean),
    resolve: {
      alias: {
        'bn.js': path.join(__dirname, 'node_modules/bn.js/lib/bn.js'),
      },
      extensions: ['.tsx', '.ts', '.js'],
      // Node plugins we can't use in the browser
      fallback: {
        https: false,
        http: false,
        os: false,
        stream: false,
        path: false,
        fs: false,
      },
    },
    devServer: {
      compress: true,
      static: {
        directory: path.join(__dirname, 'public'),
      },
      port: 3000,
      historyApiFallback: true,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
    },
    cache: {
      type: 'filesystem',
      version: JSON.stringify(env),
      store: 'pack',
      buildDependencies: {
        defaultWebpack: ['webpack/lib/'],
        config: [__filename],
      },
    },
    optimization: {
      concatenateModules: true,
      minimize: isProduction,
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            // Added for profiling in devtools
            keep_classnames: isProduction,
            keep_fnames: isProduction,
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
        }),
        new CssMinimizerPlugin(),
      ],
    },
    // Which source maps to use
    devtool: !isProduction ? 'inline-source-map' : undefined,
  };
};

export default config;
