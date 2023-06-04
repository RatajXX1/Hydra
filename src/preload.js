const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('files', {
    pathWalk: async (path) => {
        return await ipcRenderer.sendSync("PathWalk", path)
    }
  // we can also expose variables, not just functions
})