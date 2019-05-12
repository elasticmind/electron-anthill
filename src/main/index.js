import {app, BrowserWindow, Menu, dialog, ipcMain} from 'electron';
import fs from 'fs';
import * as logHelper from './logHelper';
import * as events from '../events';

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9081`
  : `file://${__dirname}/index.html`;

// TODO: try to export createWindow somehow for the main app to be able to close/reopen it
function createWindow() {
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
  });

  mainWindow.loadURL(winURL);

  const installExtension = require('electron-devtools-installer');
  installExtension.default(installExtension.VUEJS_DEVTOOLS)
      .catch((err) => {
        console.log('Unable to install `vue-devtools`: \n', err);
      });

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

let saveLogPath;

ipcMain.on(events.EVENTS_AND_SAVE, (event, events) => {
  if (saveLogPath) {
    console.log(logHelper.transformEvents(events));
    fs.writeFile(saveLogPath, logHelper.transformEvents(events));
  }
});

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Save log',
        click() {
          dialog.showSaveDialog(mainWindow, {}, function saveHandler(filePath) {
            if (filePath) {
              saveLogPath = filePath;
              mainWindow.webContents.send(events.GET_EVENTS);
            }
          });
        },
      },
    ],
  },
  {
    label: 'Development',
    submenu: [
      {
        label: 'Development Tools',
        accelerator: 'CmdOrCtrl+Shift+I',
        click() {
          mainWindow.webContents.toggleDevTools();
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
