const postcssPresetEnv = require('postcss-preset-env')

// postcssPresetEnv transforms our fancy newer-syntax css which uses things like variables,
// into browser-agnostic polyfills.
module.exports = {
  plugins: [postcssPresetEnv],
}
