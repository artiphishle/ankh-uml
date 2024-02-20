const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './src/tools/uml/cli.ts',
  target: 'node',
  externals: [nodeExternals()],
  externalsPresets: {node: true},
  output: {filename: 'bundle.js'},
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
    roots: [path.resolve(__dirname)],
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js'],
    // Add support for TypeScripts fully qualified ESM imports.
    extensionAlias: {
      '.js': ['.js', '.ts'],
      '.cjs': ['.cjs', '.cts'],
      '.mjs': ['.mjs', '.mts'],
    },
  },
  module: {
    rules: [
      // all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
      {test: /\.([cm]?ts|tsx)$/, loader: 'ts-loader'},
    ],
  },
};
