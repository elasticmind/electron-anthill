const path = require('path');
const request = require('request');
const electron = require(path.resolve(__dirname, '../node_modules/electron'));
const {spawn, fork} = require('child_process');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const {performance} = require('perf_hooks');

function post(object) {
  return request({
    uri: 'http://localhost:8000/',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    json: object,
  });
}

function stackFormatter(stack) {
  return stack;
  // return stack.slice(8).replace(/at /g, '\nat ');
}

function init() {
  fork(path.resolve(__dirname, 'restApi.js'));

  return start();
}

function register({source, sourceName}) {
  if (!(source && source.on)) {
    console.log('Something went wrong registering an eventBus...');
    return;
  }
  const old = source.on;
  source.on = function(channel, listener) {
    console.log('Registering a listener on', channel);
    function newListener(...args) {
      const toSend = {
        source: sourceName,
        channel: channel,
        timestamp: performance.now(),
        stack: stackFormatter((new Error()).stack),
      };
      post(toSend);
      return listener(...args);
    }
    old.call(source, channel, newListener);
  };
}

function startDevServer() {
  return new Promise((resolve, reject) => {
    const server = new WebpackDevServer(
        webpack({}),
        {
          contentBase: path.resolve(__dirname, '../dist/electron'),
          quiet: true,
        }
    );

    server.listen(9081, 'localhost', (error) => {
      if (error) {
        log(error);
        reject(error);
      }

      log('Started server on http://localhost:9081');
      resolve();
    });
  });
}

function startElectron() {
  const args = [
    '--inspect=5859',
    path.join(__dirname, '../dist/electron/main.js'),
  ];

  // args = args.concat(process.argv.slice(2));

  console.log('electron', electron);
  console.log('args', args);
  const electronProcess = spawn(electron, args);

  electronProcess.stdout.on('data', (data) => {
    log(data);
  });
  electronProcess.stderr.on('data', (data) => {
    log(data);
  });

  return electronProcess;
}

function start() {
  return startDevServer()
      .then(startElectron)
      .then((electronProcess) => {
        log('Anthill started!');
        return electronProcess;
      })
      .catch((error) => console.log('Something went wrong while starting Anthill', error));
}

// TODO: This log likes to silently swallow... (errors for example)
function log(data) {
  let log = '';
  data = data.toString().split(/\r?\n/);
  data.forEach((line) => {
    log += `  ${line}\n`;
  });
  if (/[0-9A-z]+/.test(log)) {
    console.log(
        '┏ Anthill -------------------' +
        '\n\n' +
        log +
        '┗ ----------------------------' +
        '\n'
    );
  }
}

module.exports = {
  init,
  register,
};
