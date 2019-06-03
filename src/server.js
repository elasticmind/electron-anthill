const path = require('path');
const electron = require(path.resolve(__dirname, '../node_modules/electron'));
const {spawn, fork} = require('child_process');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const {performance} = require('perf_hooks');
const {post} = require('./helper');

let server;

function init() {
  server = fork(path.resolve(__dirname, 'restApi.js'));

  process.on('exit', deinit);

  return start();
}

function deinit() {
  server.kill();
}

/*
Register signature:
{
  source // The emitter/bus on which the method to be intercepted is
  method // The method to be intercepted
  category // The main category of the interception, used for node grouping in the graph representation
  subcategory // The subcategory of the interception, used for further differentiation inside the category
  interceptionStrategy // A function that handles the interception process. Provided: on, send
}

Messaging signature:
{
  category // The main category of the interception, used for node grouping in the graph representation
  subcategory // The subcategory of the interception, used for further differentiation inside the category
  channel // The messaging channel the report is about
  timestamp // Timestamp of calling the registered method
}
*/
const interceptionStrategyNames = {
  on: 'on',
  send: 'send',
};

function register({source, method, category, subcategory, interceptionStrategyName}) {
  if (!(source && source[method])) {
    console.log(`Could not register ${method} of ${source}`);
    return;
  }

  const interceptionStrategies = {
    [interceptionStrategyNames.on](f) {
      return function(channel, listener) {
        function newListener(...args) {
          const toSend = {
            category,
            subcategory,
            channel,
            timestamp: performance.now(),
            interceptionStrategy: interceptionStrategyNames.on,
          };
          post(toSend);
          return listener(...args);
        }
        f.call(source, channel, newListener);
      };
    },
    [interceptionStrategyNames.send](f) {
      return function(channel, payload) {
        const toSend = {
          category,
          subcategory,
          channel,
          payload,
          timestamp: performance.now(),
          interceptionStrategy: interceptionStrategyNames.send,
        };
        post(toSend);
        f.call(source, channel, payload);
      };
    },
  };

  const interceptionStrategy = interceptionStrategies[interceptionStrategyName];
  console.log(`Registering ${method} of ${source}:
    category: ${category},
    subcategory: ${subcategory},
    interception strategy: ${interceptionStrategy}.`);
  source[method] = interceptionStrategy(source[method]);
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
  deinit,
  register,
  interceptionStrategyNames,
};
