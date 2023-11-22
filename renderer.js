const { ipcRenderer } = require('electron');

//Insere as divs em variáveis
const div_cpu_name = document.getElementById('cpu-name');
const div_cpu_manufacturer = document.getElementById('cpu-manufacturer');
const div_ram_type = document.getElementById('ram-type');
const div_ram_total = document.getElementById('ram-total');
const div_gpu_name = document.getElementById('gpu-name');
const div_gpu_manufacturer = document.getElementById('gpu-manufacturer');


const div_cpu_usage = document.getElementById('cpu-usage');
const div_cpu_usage_text = div_cpu_usage.innerHTML;
const div_ram_usage = document.getElementById('ram-usage');
const div_ram_usage_text = div_ram_usage.innerHTML;
const div_gpu_usage = document.getElementById('gpu-usage');
const div_gpu_usage_text = div_gpu_usage.innerHTML;
//------------------------------------------------------------


overlay.style.display = 'block';

//Pede o envio de dados para o main.js
ipcRenderer.send('infoRequest');

//Recebe o conteúdo de main.js e insere no html
ipcRenderer.on('cpu-info', (event, cpuBrand, cpuManufacturer) => {
    if (cpuBrand && cpuManufacturer) {
        const cpu_name = div_cpu_name.innerHTML + cpuBrand;
        const cpu_manu = div_cpu_manufacturer.innerHTML + cpuManufacturer;

        div_cpu_name.innerHTML = cpu_name;
        div_cpu_manufacturer.innerHTML = cpu_manu;
    } else {
        console.error('Invalid CPU data', cpuBrand, cpuManufacturer);
    }
});

ipcRenderer.on('ram-info', (event, ramType, ramTotal) => {
    if(ramType && ramTotal) {
        const ram_type = div_ram_type.innerHTML + ramType;
        const ram_total = div_ram_total.innerHTML + ramTotal;

        div_ram_type.innerHTML = ram_type;
        div_ram_total.innerHTML = ram_total;
    } else {
        console.error('Invalid RAM data', ramType, ramTotal);
    }
});

ipcRenderer.on('gpu-info', (event, gpuType, gpuManufacturer) => {
    if(gpuType && gpuManufacturer) {
        const gpu_name =  div_gpu_name.innerHTML + gpuType;
        const gpu_manufacturer = div_gpu_manufacturer.innerHTML + gpuManufacturer;

        div_gpu_name.innerHTML = gpu_name;
        div_gpu_manufacturer.innerHTML = gpu_manufacturer;
    } else {
        console.error('Invalid GPU data', gpuType, gpuManufacturer);
    }
});
//------------------------------------------------------------

ipcRenderer.on('UsageInfo', (event, { cpuUsage, ramUsage }) => {
    if (cpuUsage !== undefined && ramUsage !== undefined) {
        const cpuU = div_cpu_usage_text + cpuUsage.toFixed(2) + '%';
        const ramU = div_ram_usage_text + ramUsage.toFixed(2) + '%';
        div_cpu_usage.innerHTML = cpuU;
        div_ram_usage.innerHTML = ramU;
    } else {
        console.error('Invalid usage data:', { cpuUsage, ramUsage });
    }
});

ipcRenderer.on('GPUUsageInfo', (event, { gpuUsage }) => { //Not Working
    if (gpuUsage !== undefined) {
        const gpuU = div_gpu_usage_text + gpuUsage.toFixed(2) + '%';
        div_gpu_usage.innerHTML = gpuU;
    } else {
        console.error('Invalid GPU usage data:', { gpuUsage });
    }
}); 

ipcRenderer.on('data-loaded', (event, datasent) => {
    overlay.style.display = 'none';
});