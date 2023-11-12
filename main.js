const { app, BrowserWindow, ipcMain } = require('electron');
const si = require('systeminformation');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 960,
    height: 540,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.setMenu(null);
  mainWindow.loadFile('index.html');

  const sendCPUUsage = async () => {
    const cpuUsage = await si.currentLoad();
    mainWindow.webContents.send('cpu-usage', cpuUsage);
  };

  const sendRAMUsage = async () => {
    const ramUsage = await si.mem();
    mainWindow.webContents.send('ram-usage', ramUsage);
  };


  sendCPUUsage();
  sendRAMUsage();

  setInterval(sendCPUUsage, 1000);
  setInterval(sendRAMUsage, 1000);
});
