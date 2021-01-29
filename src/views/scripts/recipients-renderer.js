/*global $*/
/* global ipcRenderer*/

const Recipients = {};

function renderRecipients() {
    // const senders = ipcRenderer.sendSync('getListOfSenders');

    $("#recipients-table-body").empty()
    // senders.forEach(sender => {
    //     $("#sender-table-body").append(buildSenderRow(sender));
    // });
}

Recipients.onSaveRecipientClick = function () {

}