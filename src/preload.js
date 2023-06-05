const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('files', {
    pathWalk: async (path) => {
        return await ipcRenderer.sendSync("PathWalk", path)
    },
    makeDir: async (path) => {
        return await ipcRenderer.sendSync("MakeDir", path)
    },
    removeFile: async (path) => {
        return await ipcRenderer.sendSync("removeFile", path)
    },
    writeFile: async (path, content) => {
        return await ipcRenderer.sendSync("writeFile", path, content)
    },
  // we can also expose variables, not just functions
})