/*global $*/
/* global ipcRenderer*/

function renderPreferences() {
    const preferences = ipcRenderer.sendSync('getPreferences');
    $("#senders-file-location").text(`Lokalizacja pliku z nadawcami: ${preferences.sendersStoreLocation}`);
    $("#recipients-file-location").text(`Lokalizacja pliku z odbiorcami: ${preferences.recipientsStoreLocation}`);
    $("#confirmations-location").text(`Lokalizacja potwierdzeń: ${preferences.confirmationsLocation}`);
}

function onChangeSendersFilesLocationClick() {
    ipcRenderer.sendSync('changeSendersFileLocation');
    renderPreferences();
}

function onChangeConfirmationsLocationClick() {
    ipcRenderer.sendSync('changeConfirmationsLocation');
    renderPreferences();
}

function onChangeRecipientsLocationClick() {
    ipcRenderer.sendSync('changeRecipientsFileLocation');
    renderPreferences();
}