/*global $*/
/* global ipcRenderer*/

const Recipients = {};

function renderRecipients() {
    Recipients.recipients = Recipients.getAllRecipients();

    $("#recipients-table-body").empty()
    Recipients.recipients.forEach(recipients => {
        $("#recipients-table-body").append(Recipients.buildRecipientRow(recipients));
    });
}

Recipients.getAllRecipients = () => {
    return ipcRenderer.sendSync('getListOfRecipients');
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
    Recipients.saveRecipient(recipient);
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

Recipients.saveMultipleRecipients = (recipientsToSave, showAlert) => {
    recipientsToSave.forEach((recipient) => Recipients.saveRecipient(recipient));
    if (showAlert) {
        alert('Zapisano odbiorców');
    }
}

Recipients.saveRecipient = (recipient) => {
    const recipientToSave = {
        name: recipient.name ? recipient.name : recipient.address[0],
        address: recipient.address
    };
    console.log('Sending request to add recipient:')
    console.log(recipientToSave);
    ipcRenderer.sendSync('addRecipient', recipientToSave);
    renderRecipients();
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