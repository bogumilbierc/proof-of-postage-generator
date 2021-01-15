/*global $*/
/* global ipcRenderer*/

var processedDocuments = [];

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

function renderRecipients(document) {
    if (!document.recipients) {
        return '';
    }
    return document.recipients
        .map((recipient, index) => {
            return `<div class="form-group"><textarea id="recipient-${index} class="form-control" rows=">${recipient.address.length + 1}">${recipient.address.join('\n')}</textarea></div>`
        })
        .join('<br/>');
}

function renderProcessingSummary(processedDocuments) {
    $('#generator-summary').show();
    $('#generator-summary').empty();

    processedDocuments.forEach((document) => {

        $('#generator-summary').append(`<h3 class="text-center">${document.fileName}</h3>`);
        document.recipients.forEach((recipient, recipientIndex) => {
            $('#generator-summary').append(

                `
                <div class="row">
                <div class="col-8">
                    <textarea class="w-100" oninput="onTextAreaInput('${document.fileName}', ${recipientIndex}, 'recipient-${recipientIndex}-address')" data-filename="${document.fileName}" name="recipient-${recipientIndex}-address" id="recipient-${recipientIndex}-address">${recipient.address.join('\n')}</textarea>
                </div>
                <div class="col-2">
                    <div class="form-check">
                        <input class="form-check-input" data-filename="${document.fileName}" data-recipientindex=${recipientIndex} type="checkbox" id="recipient-${recipientIndex}-check" name="recipient-${recipientIndex}-priority">
                        <label class="form-check-label" for="recipient-${recipientIndex}-check">
                        Priorytet
                        </label>
                    </div>
                </div>
                <div class="col-2">
                    <button class="btn btn-danger" onclick="onDeleteRecipientClick('${document.fileName}', ${recipientIndex})">Usuń</button>
                </div>
            </form>`
            );
        })
        $('#generator-summary').append(`
            <div class="row">
                <div class="col text-center">
                    <button class="btn btn-success">Generuj potwierdzenie</button>
                </div>
            </div>
            `);
    });
    $('textarea').each(function () {
        this.style.height = "";
        this.style.height = this.scrollHeight + "px";
    });
}

function onTextAreaInput(fileName, recipientIndex, textAreaId) {
    const textAreaValue = $(`#${textAreaId}`).val();
    console.log(`Updating document ${fileName} for recipient: ${recipientIndex} with ${textAreaValue}`);
    processedDocuments.forEach((document) => {
        if (document.fileName === fileName) {
            document.recipients[recipientIndex].address = textAreaValue.split('\n');
        }
    })
}

function onDeleteRecipientClick(fileName, recipientIndex) {
    processedDocuments.forEach((document) => {
        if (document.fileName === fileName) {
            document.recipients.splice(recipientIndex, 1);
        }
    });
    renderProcessingSummary(processedDocuments);
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
    processedDocuments = arg;
    renderProcessingSummary(processedDocuments);
});


document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});
[]