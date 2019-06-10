module.exports = {
  root: true,
  parserOptions: {
    "parser": "babel-eslint"
  },
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: ["plugin:vue/base", 'google'],
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  'rules': {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'max-len': ["error", { "code": 140 }],
    'require-jsdoc': ["off"],
    'indent': ["error", 2],
    'no-invalid-this': ["off", 2],
  }
}
