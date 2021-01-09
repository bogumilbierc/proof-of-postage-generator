const ipcRenderer = require('electron').ipcRenderer;

function onProcessSingleFileClick() {
    console.log('sending event to ipc rendered');
    ipcRenderer.send("processSingleFileButtonClick");
}

function navigateToPage(page) {
    $('div[id$="-page"').hide();
    $(`#${page}-page`).show();
}

document.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length) {
        const paths = Object.values(event.dataTransfer.files).map((file) => file.path);
        console.log('Got list of file paths');
        console.log(paths);
        ipcRenderer.send('processListOfFiles', paths);
    }
});

document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

$(document).ready(() => {
    navigateToPage('generator');
})
