function renderPreferences() {
    const preferences = ipcRenderer.sendSync('getPreferences');
    $("#senders-file-location").text(`Lokalizacja pliku z nadawcami: ${preferences.sendersStoreLocation}`);
}

function onChangeSenderFilesLocationClick() {
    ipcRenderer.sendSync('changeSenderFileLocation');
    renderPreferences();
}