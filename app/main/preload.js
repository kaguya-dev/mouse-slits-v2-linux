// Preload script for Mouse Slits V2
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendFeatureReport: (reportId, data) => ipcRenderer.invoke('hid:sendFeatureReport', reportId, data),
  receiveFeatureReport: (reportId) => ipcRenderer.invoke('hid:receiveFeatureReport', reportId),
  isHidrawAvailable: () => ipcRenderer.invoke('hid:isAvailable')
});
