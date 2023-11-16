const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const si = require('systeminformation');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 980,
    height: 650,
    // seta o tamanho minimo e maximo da aplicacao -> ultima alteracao feita por PANIAGUA
    minHeight: 650,
    minWidth: 980,
    maxWidth: 1920,
    maxHeight: 1080,
    //----------------------------------------------------------------------------
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },

  });

  // Define o ícone da aplicação -> ultima alteracao feita por PANIAGUA
  const path = require('path');
  const iconPath = path.join(__dirname, 'img', 'icon.png');
  mainWindow.setIcon(iconPath);
  //------------------------------------------------------------

  mainWindow.setMenu(null);
  mainWindow.loadFile('hardware.html');

  const CPUInfo = async () => {
    try {
      const cpuData = await si.cpu();
      const cpuBrand = cpuData.brand;
      const cpuManufacturer = cpuData.manufacturer;
      if (mainWindow) {
        mainWindow.webContents.send('cpu-info', cpuBrand, cpuManufacturer);
      }
    } catch (error) {
      console.error('Error fetching CPU info:', error);
    }
  };

  const RAMInfo = async () => {
    try {
      const ramData = await si.mem();
      const ramIndividualData = await si.memLayout();
      const ramType = ramIndividualData[0].type;
      const ramTotal = (ramData.total / (1024 * 1024 * 1024)).toFixed(2) + " GBs";
      if (mainWindow) {
        mainWindow.webContents.send('ram-info', ramType, ramTotal);
      }
    } catch (error) {
      console.error('Error fetching RAM info:', error);
    }
  };

  const GPUInfo = async () => {
    try {
      const gpuData = await si.graphics();
      const gpuName = gpuData.model;
      const gpuManufacturer = gpuData.vendor;
      if (mainWindow) {
        mainWindow.webContents.send('gpu-info', gpuName, gpuManufacturer);
      }
    } catch (error) {
      console.error('Error fetching GPU info:', error);
    }
  };

  ipcMain.on('infoRequest', (event) => {

    CPUInfo();
    RAMInfo();
    GPUInfo();
    mainWindow.webContents.send('data-loaded');
  });



  //setInterval(sendRAMUsage, 1000);

  globalShortcut.register('CommandOrControl+Shift+I', () => {
    mainWindow.webContents.openDevTools();
  });
});
