const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  insertScore: (data) => ipcRenderer.send('insert-score', data)
});