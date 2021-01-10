function renderPreferences() {
    const preferences = ipcRenderer.sendSync('getPreferences');
    $("#senders-file-location").text(`Lokalizacja pliku z nadawcami: ${preferences.sendersStoreLocation}`);
    renderSenders();
}

function onChangeSenderFilesLocationClick() {
    ipcRenderer.sendSync('changeSenderFileLocation');
    renderPreferences();
}

$(document).ready(() => {
    renderPreferences();
})