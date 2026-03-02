const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    fullscreen: true,
    webPreferences: {
      contextIsolation: true
    }
  });

  win.loadFile(path.join(__dirname, '../public/index.html'));
}

app.whenReady().then(createWindow);