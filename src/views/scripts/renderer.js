const ipcRenderer = require('electron').ipcRenderer;

function onProcessSingleFileClick() {
    console.log('sending event to ipc rendered');
    ipcRenderer.send("processSingleFileButtonClick"); // ipcRender.send will pass the information to main process
}