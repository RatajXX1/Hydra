const { BrowserWindow, app, ipcMain} = require("electron");
const fs = require('fs');
const path = require('path');

let mainWindow = null

function createWindow() {
	mainWindow = new BrowserWindow({
			width: 800,
			height: 600,
			focusable: true,
			titleBarStyle: 'hidden',
			trafficLightPosition: {x: 10, y:15},
			frame: false,
			webPreferences: {
				nodeIntegration: false,
				preload: path.join(__dirname, 'preload.js')
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

//actualDir, pathDir
function PathWalk(ev, pathDir) {
	let Output = {}
	const ReadFiles = (paths) => {
		const files = fs.readdirSync(paths);
		const tempOutput = {}
		files.forEach((file) => {
			const filePath = path.join(paths, file);
			const stats = fs.statSync(filePath);
			

			if (stats.isFile()) {
				// It's a file
				// console.log(filePath);
			 	tempOutput[file] = filePath
			} else if (stats.isDirectory()) {
				// It's a directory
				// console.log(filePath);
				tempOutput[file] = ReadFiles(filePath); // Recursively walk through subdirectories
			}

			
		});
		return tempOutput
	}
	Output = ReadFiles(pathDir)
	// ev.reply('filewalkOutput', Output);
	// console.log("231", Output)
	ev.returnValue =Output
	return Output	
}



app.on('ready', createWindow);
ipcMain.on("PathWalk", (ev, args) => PathWalk(ev, args))
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