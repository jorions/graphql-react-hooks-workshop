// Override default prettier rules. Prettier integrates with eslint to add even
// more code readability rules. If you have Atom you can download the community
// package linter-eslint, and then turn on the setting "Fix errors on save". It
// will fix any prettier errors automatically when you save files, as well as
// fix any easily-fixable normal eslint errors.
module.exports = {
  singleQuote: true,
  printWidth: 100,
  trailingComma: 'all',
  semi: false,
}
