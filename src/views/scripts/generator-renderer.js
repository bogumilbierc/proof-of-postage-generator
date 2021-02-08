/*global $*/
/* global ipcRenderer*/
/* global Recipients */
/* global RecipientsModal */

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
 * @property {string} [name]
 * @property {string[]} address
 * @property {boolean} [priorityShipment]
 * @property {boolean} [saveRecipient]
 * @property {boolean} [retrievalConfirmation]
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
 * @param {ProcessedDocument[]} processedDocuments 
 */
Generator.renderProcessingSummary = function () {
    $('#generator-summary').show();
    $('#generator-summary').empty();

    processedDocuments.forEach((document) => {

        $('#generator-summary').append(`<h3 class="text-center">${document.fileName}</h3>`);
        document.recipients.forEach((recipient, recipientIndex) => {

            const filenameWithoutSpaces = document.fileName.replace(' ', '');
            const dataTags = `data-filename="${document.fileName}" data-recipientindex="${recipientIndex}"`;
            const priorityShipmentCheckboxId = `recipient-${recipientIndex}-${filenameWithoutSpaces}-priority-shipment-check`;
            const saveRecipientCheckboxId = `recipient-${recipientIndex}-${filenameWithoutSpaces}-save-recipient-check`;
            const retrievalConfirmation = `recipient-${recipientIndex}-${filenameWithoutSpaces}-retrieval-confirmation-check`;

            $('#generator-summary').append(

                `
                <div class="row">
                <div class="col-8">
                    <textarea class="w-100" oninput="Generator.onTextAreaInput('${document.fileName}', ${recipientIndex}, 'recipient-${recipientIndex}-address')" ${dataTags} name="recipient-${recipientIndex}-address" id="recipient-${recipientIndex}-address">${recipient.address.join('\n')}</textarea>
                </div>
                <div class="col-2">
                    <div class="form-check">
                        <input class="form-check-input" onchange="Generator.onPriorityShipmentCheckboxChange('${document.fileName}', ${recipientIndex}, '${priorityShipmentCheckboxId}')" ${dataTags} type="checkbox" id="${priorityShipmentCheckboxId}" name="recipient-${recipientIndex}-priority" ${recipient.priorityShipment ? 'checked' : ''}>
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
                    <div class="form-check">
                        <input class="form-check-input" onchange="Generator.onRetrievalConfirmationCheckboxChange('${document.fileName}', ${recipientIndex}, '${retrievalConfirmation}')" ${dataTags} type="checkbox" id="${retrievalConfirmation}" name="recipient-${recipientIndex}-retrieval-confirmation">
                        <label class="form-check-label" for="${retrievalConfirmation}">
                        Potwierdzenie odbioru
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
                    <button class="btn btn-success" onclick="Generator.onManuallyAddMoreRecipientsClick('${document.fileName}')">Dodaj więcej odbiorców</button>
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
    Generator.renderProcessingSummary();
}

Generator.onGenerateConfirmationClick = function (fileName) {
    Generator.showLoadingModal();
    const request = {
        documents: processedDocuments.filter((document) => document.fileName === fileName),
        sender: $('#generator-sender-select').val()
    }
    ipcRenderer.send('generateConfirmations', request);
}

Generator.onSaveRecipientCheckboxChange = function (fileName, recipientIndex, checkboxId) {
    const isSaveCheckboxSelected = !!$(`#${checkboxId}`).prop('checked');
    console.log(`Document ${fileName} for recipient: ${recipientIndex} save ${isSaveCheckboxSelected}`);
    processedDocuments.forEach((document) => {
        if (document.fileName === fileName) {
            document.recipients[recipientIndex].saveRecipient = isSaveCheckboxSelected;
        }
    })
}

Generator.onRetrievalConfirmationCheckboxChange = (fileName, recipientIndex, checkboxId) => {
    const isRetrievalCheckboxSelected = !!$(`#${checkboxId}`).prop('checked');
    console.log(`Document ${fileName} for recipient: ${recipientIndex} retrieval confirmation ${isRetrievalCheckboxSelected}`);
    processedDocuments.forEach((document) => {
        if (document.fileName === fileName) {
            document.recipients[recipientIndex].retrievalConfirmation = isRetrievalCheckboxSelected;
        }
    })
};


Generator.onGeneratorSaveRecipientsClick = function (fileName) {
    console.log(`This should save recipients for filename: ${fileName}`);
    /**
     * @type {ProcessedDocument}
     */
    const documentWithRecipients = processedDocuments.find((document) => document.fileName === fileName);
    if (!documentWithRecipients) {
        alert("Błąd - nie można znaleźć dopasować dokumentu, dla którego mają zostać zapisani odbiorcy!");
        return;
    }
    const recipientsToSave = documentWithRecipients.recipients.filter((recipient) => recipient.saveRecipient);
    if (!recipientsToSave || !recipientsToSave.length) {
        alert("Błąd - nie wybrano żadnych odbiorców do zapisania");
        return;
    }
    Recipients.saveMultipleRecipients(recipientsToSave, true);
}

Generator.onManuallyAddMoreRecipientsClick = function (fileName) {
    RecipientsModal.configureFor(fileName);
    RecipientsModal.show();
}

Generator.onGeneratorFilenameSaveClick = () => {
    const fileName = $('#generator-filename').val().trim();
    if (!fileName) {
        alert('Nazwa pliku jest wymagana');
        return;
    }
    /**
     * @type {ProcessedDocument}
     */
    const manuallyCreatedDocument = {
        fileName,
        recipients: []
    };
    processedDocuments.push(manuallyCreatedDocument);
    Generator.renderProcessingSummary();
    $('#generator-filename-modal').modal('hide');
}

Generator.onGenerateWithoutInputFileClick = () => {
    $('#generator-filename').val('');
    $('#generator-filename-modal').modal('show');
}

Generator.showLoadingModal = () => {
    $('#loading-modal').modal('show');
};

Generator.hideLoadingModal = () => {
    console.log('Trying to hide loading modal');
    $('#loading-modal').modal('hide');
    window.setTimeout(() => $('#loading-modal').modal('hide'), 1000);
}

Generator.onGeneratorModalFilenameKeyup = (event) => {
    if (event.keyCode === 13) {
        Generator.onGeneratorFilenameSaveClick();
    }
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
    Generator.renderProcessingSummary();
});

ipcRenderer.on('generateConfirmationsResponse', (event, processedDocuments) => {
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
        $(`div[data-filename~="'${document.fileName}'"`).append(statusText);
    });
    Generator.hideLoadingModal();
});


document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});
[]