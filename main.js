const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const si = require('systeminformation');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 980,
    height: 650,
    // seta o tamanho minimo e maximo da aplicacao
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

  // Define o ícone da aplicação
  const path = require('path');
  const iconPath = path.join(__dirname, 'img', 'icon.png');
  mainWindow.setIcon(iconPath);
  //------------------------------------------------------------

  mainWindow.setMenu(null);
  mainWindow.loadFile('hardware.html');

  let datasent = 0;


  //Funções das infos básicas
  const CPUInfo = async () => {
    try {
      const cpuData = await si.cpu();
      const cpuBrand = cpuData.brand;
      const cpuManufacturer = cpuData.manufacturer;
      datasent++;
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
      datasent++;
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
      const gpuName = gpuData.controllers[0].model;;
      const gpuManufacturer = gpuData.controllers[0].vendor;
      datasent++;
      if (mainWindow) {
        mainWindow.webContents.send('gpu-info', gpuName, gpuManufacturer);
      }
    } catch (error) {
      console.error('Error fetching GPU info:', error);
    }
  };
  //------------------------------------------------------------

  //Função da info de uso
  const UsageInfo = async () => {
    try {
      const { currentLoad } = await si.currentLoad();
      const { used, total } = await si.mem();
      const ramUsage = (used / total) * 100;

      mainWindow.webContents.send('UsageInfo', { cpuUsage: currentLoad, ramUsage});
    } catch (error) {
        console.error('Error fetching usage information:', error);
    }
  }

  const GPUUsageInfo = async () => {
    try {
      const gpuData = await si.graphics();
      const gpuUsage = gpuData.controllers[0].utilizationGpu;
      mainWindow.webContents.send('GPUUsageInfo', { gpuUsage }); 
    } catch (error) {
      console.error('Error fetching GPU usage information:', error);
    }
  }
  //------------------------------------------------------------

  let intervalId;
  function loadCheck() {
    if (datasent < 3) {
        intervalId = setInterval(loadCheck, 1000);
    } else {
        clearInterval(intervalId); // Clear the interval
        mainWindow.webContents.send('data-loaded');
    }
  }

  ipcMain.on('infoRequest', (event) => {
    CPUInfo();
    RAMInfo();
    GPUInfo();
    loadCheck();
  });

  setInterval(UsageInfo, 1200);
  //setInterval(GPUUsageInfo, 1200);

  globalShortcut.register('CommandOrControl+Shift+I', () => {
    mainWindow.webContents.openDevTools();
  });
});
