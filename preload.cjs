const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  addItem: (item) => ipcRenderer.invoke('add-item', item),
  getItems: () => ipcRenderer.invoke('get-items')
});