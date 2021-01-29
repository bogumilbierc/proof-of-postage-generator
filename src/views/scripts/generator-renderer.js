/*global $*/
/* global ipcRenderer*/

/** 
 * @typedef {object} ProcessedDocument 
 * @property {string} path
 * @property {string} fileName
 * @property {string} [message]
 * @property {boolean} success
 * @property {Recipient[]} recipients
*/

/**
 * @typedef {object} Recipient
 * @property {string[]} address
 * @property {boolean} [priorityShipment]
 */

/**
 * @type {ProcessedDocument[]}
 */
let processedDocuments = [];
const Generator = {};

function renderGenerator() {
    console.log('rendering generator');
    const senders = ipcRenderer.sendSync('getListOfSenders');
    $('#generator-sender-select').empty();
    senders.forEach((sender) => {
        $('#generator-sender-select').append(`<option ${sender.isDefault ? 'selected' : ''} value="${sender.name}">${sender.name}</option>`);
    });
}

Generator.onProcessSingleFileClick = function () {
    console.log('Sending event to ipc renderer - not paths');
    const processRequest = {
        sender: $('#generator-sender-select').val()
    }
    $('#generator-summary-wrapper').hide();
    ipcRenderer.send('processDocuments', processRequest);
}

/**
 * 
 * @param {ProcessedDocument} document 
 */
Generator.renderRecipients = function (document) {
    if (!document.recipients) {
        return '';
    }
    return document.recipients
        .map((recipient, index) => {
            return `<div class="form-group"><textarea id="recipient-${index} class="form-control" rows=">${recipient.address.length + 1}">${recipient.address.join('\n')}</textarea></div>`
        })
        .join('<br/>');
}

/**
 * 
 * @param {ProcessedDocument[]} processedDocuments 
 */
Generator.renderProcessingSummary = function (processedDocuments) {
    $('#generator-summary').show();
    $('#generator-summary').empty();

    processedDocuments.forEach((document) => {

        $('#generator-summary').append(`<h3 class="text-center">${document.fileName}</h3>`);
        document.recipients.forEach((recipient, recipientIndex) => {

            const dataTags = `data-filename="${document.fileName}" data-recipientindex="${recipientIndex}"`;
            const priorityShipmentCheckboxId = `recipient-${recipientIndex}-priority-shipment-check`;
            const saveRecipientCheckboxId = `recipient-${recipientIndex}-save-recipient-check`;

            $('#generator-summary').append(

                `
                <div class="row">
                <div class="col-8">
                    <textarea class="w-100" oninput="Generator.onTextAreaInput('${document.fileName}', ${recipientIndex}, 'recipient-${recipientIndex}-address')" ${dataTags} name="recipient-${recipientIndex}-address" id="recipient-${recipientIndex}-address">${recipient.address.join('\n')}</textarea>
                </div>
                <div class="col-2">
                    <div class="form-check">
                        <input class="form-check-input" onchange="Generator.onPriorityShipmentCheckboxChange('${document.fileName}', ${recipientIndex}, '${priorityShipmentCheckboxId}')" ${dataTags} type="checkbox" id="${priorityShipmentCheckboxId}" name="recipient-${recipientIndex}-priority">
                        <label class="form-check-label" for="${priorityShipmentCheckboxId}">
                        Priorytet
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" onchange="Generator.onSaveRecipientCheckboxChange('${document.fileName}', ${recipientIndex}, '${saveRecipientCheckboxId}')" ${dataTags} type="checkbox" id="${saveRecipientCheckboxId}" name="recipient-${recipientIndex}-save-recipient">
                        <label class="form-check-label" for="${saveRecipientCheckboxId}">
                        Zapisz
                        </label>
                    </div>
                </div>
                <div class="col-2">
                    <button class="btn btn-danger" onclick="Generator.onDeleteRecipientClick('${document.fileName}', ${recipientIndex})">Usuń</button>
                </div>
            </form>`
            );
        })
        $('#generator-summary').append(`
            <div class="row" data-filename="'${document.fileName}'">
                <div class="col text-center">
                    <button class="btn btn-success" onclick="Generator.onGeneratorSaveRecipientsClick('${document.fileName}')">Zapisz odbiorców</button>
                </div>
                <div class="col text-center">
                    <button class="btn btn-success" onclick="Generator.onGenerateConfirmationClick('${document.fileName}')">Generuj potwierdzenie</button>
                </div>
            </div>
            `);
    });
    $('textarea').each(function () {
        this.style.height = "";
        this.style.height = this.scrollHeight + "px";
    });
}

Generator.onTextAreaInput = function (fileName, recipientIndex, textAreaId) {
    const textAreaValue = $(`#${textAreaId}`).val();
    console.log(`Updating document ${fileName} for recipient: ${recipientIndex} with ${textAreaValue}`);
    processedDocuments.forEach((document) => {
        if (document.fileName === fileName) {
            document.recipients[recipientIndex].address = textAreaValue.split('\n');
        }
    })
}

Generator.onPriorityShipmentCheckboxChange = function (fileName, recipientIndex, checkboxId) {
    const isPriorityShipmentSelected = !!$(`#${checkboxId}`).prop('checked');
    console.log(`Updating document ${fileName} for recipient: ${recipientIndex} with priority shipment ${isPriorityShipmentSelected}`);
    processedDocuments.forEach((document) => {
        if (document.fileName === fileName) {
            document.recipients[recipientIndex].priorityShipment = isPriorityShipmentSelected;
        }
    })
}

Generator.onDeleteRecipientClick = function (fileName, recipientIndex) {
    processedDocuments.forEach((document) => {
        if (document.fileName === fileName) {
            document.recipients.splice(recipientIndex, 1);
        }
    });
    Generator.renderProcessingSummary(processedDocuments);
}

Generator.onGenerateConfirmationClick = function (fileName) {
    $('#loading-modal').modal('show');
    const request = {
        documents: processedDocuments.filter((document) => document.fileName === fileName),
        sender: $('#generator-sender-select').val()
    }
    ipcRenderer.send('generateConfirmations', request);
}

Generator.onSaveRecipientCheckboxChange = function (fileName, recipientIndex, checkboxId) {
    const isSaveCheckboxSelected = !!$(`#${checkboxId}`).prop('checked');
    console.log(`Document ${fileName} for recipient: ${recipientIndex} save ${isSaveCheckboxSelected}`);
}


Generator.onGeneratorSaveRecipientsClick = function (fileName) {
    console.log(`This should save recipients for filename: ${fileName}`);
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
    Generator.renderProcessingSummary(processedDocuments);
});

ipcRenderer.on('generateConfirmationsResponse', (event, processedDocuments) => {
    $('#loading-modal').modal('hide');
    console.log('Generation response from backend:');
    console.log(processedDocuments);

    processedDocuments.forEach((document) => {
        let statusText = '';
        if (document.pdfGenerated) {
            statusText =
                `
                    <div class="col">
                        <p><b>Sukces:</b> TAK</p>
                        <p><b>Potwierdzenie:</b> ${document.confirmationLocation}</p>
                    </div>
            `
        } else {
            statusText =
                `
                <div class="col">
                    <p><b>Sukces:</b> NIE</p>
                    <p><b>Błąd:</b> ${document.message}</p>
                </div>
        `
        }
        $(`div[data-filename~="'${document.fileName}'"`).append(statusText)
    })
});


document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});
[]