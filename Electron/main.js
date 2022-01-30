/* eslint-disable */
const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    minWidth: 450,
    minHeight: 600,
    show: false,
    webPreferences: {
      contextIsolation: false,
      enableRemoteModule: true,
    },
    title: 'zero-day',
  });
  const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startURL);
  mainWindow.removeMenu();
  mainWindow.webContents.openDevTools();

  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
