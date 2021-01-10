function renderSenders() {
    const senders = ipcRenderer.sendSync('getListOfSenders');

    $("#sender-table-body").empty()
    senders.forEach(sender => {
        $("#sender-table-body").append(buildSenderRow(sender));
    });
}

function onSaveSenderClick() {
    const sender = {
        name: $("#add-sender-name").val(),
        address: $("#add-sender-address").val().split('\n')
    };
    if (!sender.name) {
        alert('Nazwa jest wymagana');
        return;
    }
    if (!sender.address.length || !sender.address[0]) {
        alert('Adres jest wymagany');
        return;
    }
    console.log('Sending request to add sender:')
    console.log(sender);
    ipcRenderer.sendSync('addSender', sender);
    renderSenders();
}

function onDeleteSenderClick(senderName) {
    console.log(`Sending request to delete sender: ${senderName}`);
    ipcRenderer.sendSync('deleteSender', senderName);
    renderSenders();
}

function onSetSenderAsDefaultClick(senderName) {
    console.log(`Sending request to set sender as default: ${senderName}`);
    ipcRenderer.sendSync('setSenderAsDefault', senderName);
    renderSenders();
}

function buildSenderRow(sender) {
    return `<tr>
    <td>${sender.name}</td>
    <td>${buildAddressColumnText(sender)}</td>
    <td>${sender.isDefault ? 'TAK' : ''}</td>
    <td>
            <button class="btn btn-info" onclick="onSetSenderAsDefaultClick('${sender.name}')">Ustaw jako domyślny</button>
            <button class="btn btn-danger" onclick="onDeleteSenderClick('${sender.name}')">Usuń</button>
    </td>
    
    </tr>`;
}

function buildAddressColumnText(sender) {
    let html = '';
    for (let i = 0; i < sender.address.length; i++) {
        html += sender.address[i];
        if (i !== sender.address.length - 1) {
            html += '<br/>'
        }
    }
    return html;
}