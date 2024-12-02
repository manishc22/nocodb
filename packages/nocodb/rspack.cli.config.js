const path = require('path');
const { rspack } = require('@rspack/core');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/cli.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin({
        minimizerOptions: {
          format: {
            comments: false,
          },
        },
      }),
    ],
    nodeEnv: false,
  },
  externals: [nodeExternals({
    allowlist: ['nocodb-sdk']
  })],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    tsConfig: {
      configFile: path.resolve('tsconfig.json'),
    },
  },
  mode: 'production',
  output: {
    filename: 'cli.js',
    path: path.resolve(__dirname, '..', 'nc-secret-mgr', 'src/nocodb'),
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
    new rspack.BannerPlugin({
      banner: 'This is a generated file. Do not edit',
      entryOnly: true,
    }),
  ],
  target: 'node',
};
