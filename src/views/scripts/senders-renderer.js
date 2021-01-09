function onAddSenderClick() {

}

function onDeleteSenderClick(senderName) {
    console.log(`delete sender: ${senderName}`)
}

function renderSenders() {
    const senders = [
        {
            name: 'Darth Vader',
            address: [
                'Darth Vader',
                'ul. Gwiazdy Śmierci 12',
                '00-200 Imperium'
            ]
        },
        {
            name: 'Test 2',
            address: [
                'Super Test2',
                'Dodatkowa linia',
                'ul. Kasztanowa 13',
                '10-200 NieWarszawa'
            ]
        },
        {
            name: 'Test3',
            address: [
                'Super Test3',
                'ul. Jarzębinowa 13',
                '10-200 NieWarszawa'
            ]
        }
    ];

    $("#sender-table-body").empty()
    senders.forEach(sender => {
        $("#sender-table-body").append(buildSenderRow(sender));
    });
}

function buildSenderRow(sender) {
    return `<tr>
    <td>${sender.name}</td>
    <td>${buildAddressColumnText(sender)}</td>
    <td>
            <button disabled class="btn btn-info">Ustaw jako domyślny</button>
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
}

$(document).ready(() => {
    renderSenders();
})
