const ipcRenderer = require('electron').ipcRenderer;

function onProcessSingleFileClick() {
    console.log('sending event to ipc rendered');
    ipcRenderer.send("processSingleFileButtonClick");
}

function navigateToPage(page) {
    $('div[id$="-page"').hide();
    $('a[id$="-nav-link"').removeClass('active');
    $(`#${page}-page`).show();
    $(`#${page}-nav-link`).addClass('active');
}

document.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length) {
        const paths = Object.values(event.dataTransfer.files).map((file) => file.path);
        $("#generator-file-list").empty();
        paths.forEach((path) => {
            $("#generator-file-list").append(`<li>${path}</li>`);
        });
        ipcRenderer.send('processListOfFiles', paths);
    }
});

document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

$(document).ready(() => {
    navigateToPage('generator');
    renderGenerator();
})

function renderGenerator() {
    console.log('rendering generator');
    const senders = ipcRenderer.sendSync('getListOfSenders');
    $('#generator-sender-select').empty();
    senders.forEach((sender) => {
        $('#generator-sender-select').append(`<option ${sender.isDefault ? 'selected' : ''} value="${sender.name}">${sender.name}</option>`);
    });
}