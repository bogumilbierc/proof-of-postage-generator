/*global $*/
/* global ipcRenderer*/

const Recipients = {};

function renderRecipients() {
    Recipients.recipients = ipcRenderer.sendSync('getListOfRecipients');

    $("#recipients-table-body").empty()
    Recipients.recipients.forEach(recipients => {
        $("#recipients-table-body").append(Recipients.buildRecipientRow(recipients));
    });
}

Recipients.onSaveRecipientClick = () => {
    const recipient = {
        name: $("#add-recipient-name").val(),
        address: $("#add-recipient-address").val().split('\n')
    };
    if (!recipient.name) {
        alert('Nazwa jest wymagana');
        return;
    }
    const nameAlreadyExists = Recipients.recipients.some((currentRecipient) => currentRecipient.name === recipient.name);
    if (nameAlreadyExists) {
        alert('Nazwa jest już zajęta');
        return;
    }
    if (!recipient.address.length || !recipient.address[0]) {
        alert('Adres jest wymagany');
        return;
    }
    console.log('Sending request to add recipient:')
    console.log(recipient);
    ipcRenderer.sendSync('addRecipient', recipient);
    renderRecipients();
}

Recipients.buildRecipientRow = (recipient) => {
    return `<tr>
    <td>${recipient.name}</td>
    <td>${Recipients.buildAddressColumnText(recipient)}</td>
    <td>
            <button class="btn btn-danger" onclick="Recipients.onDeleteRecipientClick('${recipient.name}')">Usuń</button>
    </td>
    
    </tr>`;
}

Recipients.onDeleteRecipientClick = (recipientName) => {
    console.log(`Sending request to delete recipient: ${recipientName}`);
    ipcRenderer.sendSync('deleteRecipient', recipientName);
    renderRecipients();
}

Recipients.buildAddressColumnText = (recipient) => {
    let html = '';
    for (let i = 0; i < recipient.address.length; i++) {
        html += recipient.address[i];
        if (i !== recipient.address.length - 1) {
            html += '<br/>'
        }
    }
    return html;
}