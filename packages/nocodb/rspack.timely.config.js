const path = require('path');
const { rspack } = require('@rspack/core');
const { resolveTsAliases } = require('./build-utils/resolveTsAliases');

module.exports = {
  entry: './src/run/timely.ts',
  module: {
    rules: [
      {
        test: /\.node$/,
        loader: 'node-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
              decorators: true,
              dynamicImport: true,
            },
            transform: {
              legacyDecorator: true,
              decoratorMetadata: true,
            },
            target: 'es2017',
          },
          module: {
            type: 'commonjs',
          },
        },
      },
    ],
  },

  optimization: {
    minimize: true, //Update this to true or false
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin({
        minimizerOptions: {
          compress: {
            keep_classnames: true,
          },
        },
      }),
    ],
    nodeEnv: false,
  },
  externals: {
    '@nestjs/microservices': '@nestjs/microservices',
    '@nestjs/microservices/microservices-module':
      '@nestjs/microservices/microservices-module',
    sharp: 'commonjs sharp',
    'nocodb-sdk': 'nocodb-sdk',
    'pg-query-stream': 'pg-query-stream',
    'better-sqlite3': 'better-sqlite3',
    oracledb: 'oracledb',
    'pg-native': 'pg-native',
    '@nestjs/graphql': '@nestjs/graphql',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json', '.node'],
    alias: resolveTsAliases(path.resolve('./tsconfig.json')),
  },
  mode: 'production',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'docker'),
    library: 'libs',
    libraryTarget: 'umd',
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  node: {
    __dirname: false,
  },
  plugins: [
    new rspack.EnvironmentPlugin({
      EE: true,
    }),
    new rspack.CopyRspackPlugin({
      patterns: [{ from: 'src/public', to: 'public' }],
    }),
  ],
  target: 'node',
};