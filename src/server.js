const WebSocket = require('ws');
const path = require('path');
const electron = require(path.resolve(__dirname, '../node_modules/electron'));
const {spawn} = require('child_process');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

let connectedWs;

function init() {
  const wss = new WebSocket.Server({host: '127.0.0.1', port: 8080});

  wss.on('connection', function connection(ws) {
    log('SERVER: connection built');
    connectedWs = ws;
  });

  return start();
}

function register(source) {
  if (!(source && source.on)) {
    log('Something went wrong registering an eventBus...');
  }
  const old = source.on;
  source.on = function(channel, listener) {
    log('Registering a listener on', channel);
    function newListener(...args) {
      log('holly cow this works!', channel);
      connectedWs && connectedWs.send('something happened ' + channel);
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
