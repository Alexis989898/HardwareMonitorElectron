const { ipcRenderer } = require('electron');

//Insere as divs em variáveis
const div_cpu_name = document.getElementById('cpu-name');
const div_cpu_name_previous = div_cpu_name.innerHTML;

const div_cpu_manufacturer = document.getElementById('cpu-manufacturer');
const div_cpu_manufacturer_previous = div_cpu_manufacturer.innerHTML;

const div_ram_type = document.getElementById('ram-type');
const div_ram_type_previous = div_ram_type.innerHTML;

const div_ram_total = document.getElementById('ram-total');
const div_ram_total_previous = div_ram_total.innerHTML;

const div_gpu_name = document.getElementById('gpu-name');
const div_gpu_name_previous = div_gpu_name.innerHTML;

const div_gpu_manufacturer = document.getElementById('gpu-manufacturer');
const div_gpu_manufacturer_previuos = div_gpu_manufacturer.innerHTML;
//------------------------------------------------------------


overlay.style.display = 'block';

//Pede o envio de dados para o main.js
ipcRenderer.send('infoRequest');

//Recebe o conteúdo de main.js
ipcRenderer.on('cpu-info', (event, cpuBrand, cpuManufacturer) => {
    if (cpuBrand && cpuManufacturer) {
        const cpu_name = div_cpu_name_previous + cpuBrand;
        const cpu_manu = div_cpu_manufacturer_previous + cpuManufacturer;

        div_cpu_name.innerHTML = cpu_name;
        div_cpu_manufacturer.innerHTML = cpu_manu;
    } else {
        console.error('Invalid CPU data', cpuBrand, cpuManufacturer);
    }
});

ipcRenderer.on('ram-info', (event, ramType, ramTotal) => {
    if(ramType && ramTotal) {
        const ram_type = div_ram_type_previous + ramType;
        const ram_total = div_ram_total_previous + ramTotal;

        div_ram_type.innerHTML = ram_type;
        div_ram_total.innerHTML = ram_total;
    } else {
        console.error('Invalid RAM data', ramType, ramTotal);
    }
});

ipcRenderer.on('gpu-info', (event, gpuType, ramTotal) => {

});
//------------------------------------------------------------

ipcRenderer.on('data-loaded', () => {
    overlay.style.display = 'none';
});


/*
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
*/
