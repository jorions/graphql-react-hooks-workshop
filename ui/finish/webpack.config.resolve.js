const path = require('path')

// These settings define how to handle file paths and extensions. This does not need
// to be specified for default .js behavior, but because we are adding .jsx and
// aliases we need it.

// Maps shorthand import strings to full file paths
// - For ex: 'components' instead of '../../components'
const alias = {
  apps: path.resolve(__dirname, 'src/apps'),
  components: path.resolve(__dirname, 'src/components'),
  lib: path.resolve(__dirname, 'src/lib'),
  // $ denotes that nothing should come after "routes" because it is a file, not a folder
  routes$: path.resolve(__dirname, 'src/routes.js'),
  schemaValues$: path.resolve(__dirname, 'src/schemaValues.js'),
}

// Alias react-dom calls to use a hot-reloading version of react-dom
if (process.env.NODE_ENV === 'development') alias['react-dom'] = '@hot-loader/react-dom'

// Return a nested resolve key so that eslint-import-resolver-webpack can read it
module.exports = {
  resolve: {
    alias,
    // Defines which file extensions should be resolved automatically.
    // - Without this, we would need to add '.jsx' to each import statement. Now,
    // it resolves automatically, allowing Webpack to turn it into a JS file.
    extensions: ['.js', '.jsx'],
  },
}
