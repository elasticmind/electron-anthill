const WebSocket = require('ws');
const {start} = require('../.electron-vue/dev-runner');

let connectedWs;

function init() {
  const wss = new WebSocket.Server({host: '127.0.0.1', port: 8080});

  wss.on('connection', function connection(ws) {
    console.log('SERVER: connection built');
    connectedWs = ws;
  });

  return start();
}

function register(source) {
  if (!(source && source.on)) {
    console.log('Something went wrong registering an eventBus...');
  }
  const old = source.on;
  source.on = function(channel, listener) {
    console.log('Registering a listener on', channel);
    function newListener(...args) {
      console.log('holly cow this works!', channel);
      connectedWs && connectedWs.send('something happened ' + channel);
      return listener(...args);
    }
    old.call(source, channel, newListener);
  };
}

module.exports = {
  init,
  register,
};
