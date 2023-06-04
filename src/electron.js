// import { BrowserWindow, app } from "electron";
const { BrowserWindow, app } = require("electron");


let mainWindow = null
let isDragging = false;
let offset = { x: 0, y: 0 };

function createWindow() {
  mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      focusable: true,
      titleBarStyle: 'hidden',
      trafficLightPosition: {x: 10, y:15},
      frame: false,
      webPreferences: {
          nodeIntegration: false
      }
  })

  mainWindow.loadURL('http://localhost:3000');
  mainWindow.webContents.openDevTools();


  // mainWindow.loadURL(
  //     url.format({
  //       pathname: path.join(__dirname, '../index.html'),
  //       protocol: 'file:',
  //       slashes: true,
  //     })
  //   );

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
  if (mainWidnow === null) {
    createWindow();
  }
});