/*global $*/
/* global ipcRenderer*/

function renderPreferences() {
    const preferences = ipcRenderer.sendSync('getPreferences');
    $("#senders-file-location").text(`Lokalizacja pliku z nadawcami: ${preferences.sendersStoreLocation}`);
    $("#confirmations-location").text(`Lokalizacja potwierdzeń: ${preferences.confirmationsLocation}`);
}

function onChangeSenderFilesLocationClick() {
    ipcRenderer.sendSync('changeSenderFileLocation');
    renderPreferences();
}

function onChangeConfirmationsLocationClick() {
    ipcRenderer.sendSync('changeConfirmationsLocation');
    renderPreferences();
}