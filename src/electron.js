const { BrowserWindow, app, ipcMain} = require("electron");
const { screen } = require("electron/main");
const fs = require('fs');
const path = require('path');

let mainWindow = null

function createWindow() {
	const { width, height } = screen.getPrimaryDisplay().workAreaSize;
	mainWindow = new BrowserWindow({
			width: Math.floor(width * 0.5),
			height: Math.floor(height * 0.8),
			focusable: true,
			titleBarStyle: 'hidden',
			trafficLightPosition: {x: 10, y:15},
			frame: false,
			minHeight: 420,
			minWidth: 800,
			title: "Hydra",
			center: true,
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

function PathWalk(ev, pathDir) {
	const ReadFiles = (paths) => {
		const files = fs.readdirSync(paths);
		const tempOutput = {}
		files.forEach((file) => {
			const filePath = path.join(paths, file);
			const stats = fs.statSync(filePath);
			if (file.startsWith(".")) return
			if (stats.isFile())
			 	tempOutput[file] = filePath
			else if (stats.isDirectory()) 
				tempOutput[file] = ReadFiles(filePath); 		
		});
		return tempOutput
	}
	ev.returnValue = ReadFiles(pathDir)
}

function CreateDir(ev, pathDir) {
	if (fs.existsSync(pathDir)) {
		ev.returnValue = false
		return
	} else {
		console.log(pathDir)
		fs.mkdir(pathDir, (err) => {
			// console.log("blad", err)
		});
		ev.returnValue = true
	}
}

function writeFile(ev, pathDir, content) {
	fs.writeFile(pathDir, content, (err) => {
        if(err){
			ev.returnValue = false
			return
        }
                    
		ev.returnValue = true
    });
}

function removeFile(ev, pathDir) {
	fs.unlinkSync(pathDir);;
	ev.returnValue = true
}

app.setName("Hydra")
app.on('ready', createWindow);

ipcMain.on("PathWalk", (ev, args) => PathWalk(ev, args))
ipcMain.on("MakeDir", (ev, args) => CreateDir(ev, args))
ipcMain.on("removeFile", (ev, args) => removeFile(ev, args))
ipcMain.on("writeFile", (ev, arg, content) => writeFile(ev, arg, content))

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