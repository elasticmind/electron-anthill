import {app, BrowserWindow} from 'electron';
import WebSocket from 'ws';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9081`
  : `file://${__dirname}/index.html`;

// TODO: try to export createWindow somehow for the main app to be able to close/reopen it
function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
  });

  mainWindow.loadURL(winURL);

  setupWS();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

function setupWS() {
  const websocket = new WebSocket('ws://127.0.0.1:8080');
  let i = 0;
  websocket.onerror = function(event) {
    console.log('ERROR', JSON.stringify(event, null, 2));
  };
  websocket.onopen = function(event) {
    console.log('MAIN: client opened');
  };
  websocket.onclose = function(event) {
    console.log('MAIN: client closed');
  };
  websocket.onmessage = function(event) {
    console.log('MAIN: client recieved:', event.data, ++i);
  };
}
