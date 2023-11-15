const { app, BrowserWindow, ipcMain } = require('electron');
const si = require('systeminformation');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 980,
    height: 650,
    // seta o tamanho minimo e maximo da aplicacao -> ultima alteracao feita por PANIAGUA
    minHeight:650,
    minWidth:980,
    maxWidth:1920,
    maxHeight:1080,
    //----------------------------------------------------------------------------
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    
  });

  // Define o ícone da aplicação -> ultima alteracao feita por PANIAGUA
  mainWindow.setIcon("./img/icon.png");
  //------------------------------------------------------------

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
