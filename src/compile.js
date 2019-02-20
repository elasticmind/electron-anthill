'use strict';

const chalk = require('chalk');
const webpack = require('webpack');

const mainConfig = require('../.electron-vue/webpack.main.config');
const rendererConfig = require('../.electron-vue/webpack.renderer.config');

function logStats(proc, data) {
  let log = '';

  log += chalk.yellow.bold(`┏ ${proc} Process ${new Array((19 - proc.length) + 1).join('-')}`);
  log += '\n\n';

  if (typeof data === 'object') {
    data.toString({
      colors: true,
      chunks: false,
    }).split(/\r?\n/).forEach((line) => {
      log += '  ' + line + '\n';
    });
  } else {
    log += `  ${data}\n`;
  }

  log += '\n' + chalk.yellow.bold(`┗ ${new Array(28 + 1).join('-')}`) + '\n';

  console.log(log);
}

function compileMain() {
  return new Promise((resolve, reject) => {
    mainConfig.mode = 'development';
    const compiler = webpack(mainConfig);

    compiler.watch({}, (err, stats) => {
      if (err) {
        console.log(err);
        reject(err);
      }

      resolve();
    });
  });
}

function compileRenderer() {
  return new Promise((resolve, reject) => {
    rendererConfig.mode = 'development';
    const compiler = webpack(rendererConfig);

    compiler.hooks.compilation.tap('compilation', (compilation) => {
      compilation.hooks.htmlWebpackPluginAfterEmit.tapAsync('html-webpack-plugin-after-emit', (data, cb) => {
        cb();
      });
    });

    compiler.watch({}, (err, stats) => {
      if (err) {
        console.log(err);
        reject(err);
      }

      resolve();
    });
  });
}

Promise.all([compileMain(), compileRenderer()])
    .then(() => console.log('Compile succesful!'))
    .catch((error) => console.log('Compile failed!', error))
    .then(() => process.exit(0));
