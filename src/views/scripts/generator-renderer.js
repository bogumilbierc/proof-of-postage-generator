function renderGenerator() {
    console.log('rendering generator');
    const senders = ipcRenderer.sendSync('getListOfSenders');
    $('#generator-sender-select').empty();
    senders.forEach((sender) => {
        $('#generator-sender-select').append(`<option ${sender.isDefault ? 'selected' : ''} value="${sender.name}">${sender.name}</option>`);
    });
}

function onProcessSingleFileClick() {
    console.log('Sending event to ipc renderer - not paths');
    const processRequest = {
        sender: $('#generator-sender-select').val()
    }
    $('#generator-summary-wrapper').hide();
    ipcRenderer.send('processDocuments', processRequest);
}

function renderProcessingSummary(processedDocuments) {
    $('#generator-summary-wrapper').show();
    $('#generator-summary').empty();

    processedDocuments.forEach((document) => {
        $('#generator-summary').append(
            `<tr>
                <td>${document.path}</td>
                <td>${document.pdfGenerated}</td>
                <td>${document.recipient}</td>
                <td>${document.pdfGenerated ? document.confirmationLocation : ''}</td>
            </tr>`
        );
    });
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

        console.log('Sending event to ipc renderer - with paths');
        const processRequest = {
            paths,
            sender: $('#generator-sender-select').val()
        }
        $('#generator-summary-wrapper').hide();
        ipcRenderer.send('processDocuments', processRequest);
    }
});

ipcRenderer.on('processDocumentsResponse', (event, arg) => {
    console.log('Processing response from backend:');
    console.log(arg);
    renderProcessingSummary(arg);
});


document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});
