# electron-anthill

> A simple Electron application that enables you to visualize communication of event emitters.

#### Usage in an Electron application

After installing the `electron-anthill` package, paste the following into your `main/index.js`.
```js
const anthill = __non_webpack_require__('electron-anthill');
anthill.init();
anthill.register({
  source: ipcMain,
  method: 'on',
  category: 'Main',
  subcategory: 'on',
  interceptionStrategyName: anthill.interceptionStrategyNames.on,
});
```

```js
anthill.register({
  source: mainWindow.webContents,
  method: 'send',
  category: 'Main',
  subcategory: 'send',
  interceptionStrategyName: anthill.interceptionStrategyNames.send,
});
```

After, in your `renderer/main.js` paste the following:
```js
const anthill = __non_webpack_require__('electron-anthill');
anthill.register({
  source: ipcRenderer,
  method: 'on',
  category: 'Renderer',
  subcategory: 'on',
  interceptionStrategyName: anthill.interceptionStrategyNames.on,
});
anthill.register({
  source: ipcRenderer,
  method: 'send',
  category: 'Renderer',
  subcategory: 'send',
  interceptionStrategyName: anthill.interceptionStrategyNames.send,
});
```

Running your application will now start up Electron Anthill and you shall see and anaylize the communications in your software.