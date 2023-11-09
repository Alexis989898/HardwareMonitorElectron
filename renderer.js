const { ipcRenderer } = require('electron');

const cpuUsageElement = document.getElementById('cpu-usage');
const ramUsageElement = document.getElementById('ram-usage');

ipcRenderer.on('cpu-usage', (event, cpuUsage) => {
    if (cpuUsage && cpuUsage.currentLoad) {
        const currentLoad = cpuUsage.currentLoad;
        const usageString = `CPU Load: ${currentLoad.toFixed(2)}%`;
        cpuUsageElement.innerText = usageString;
    } else {
        console.error('Invalid CPU usage data:', cpuUsage);
    }
});

ipcRenderer.on('ram-usage', (event, ramUsage) => {
    if (ramUsage && ramUsage.used && ramUsage.total) {
        const usedMemory = ramUsage.used / 1024 / 1024;
        const totalMemory = ramUsage.total / 1024 / 1024;
        const usageString = `RAM Usage: ${usedMemory.toFixed(2)} MB / ${totalMemory.toFixed(2)} MB`;
        ramUsageElement.innerText = usageString;
    } else {
        console.error('Invalid RAM usage data:', ramUsage);
    }
});
