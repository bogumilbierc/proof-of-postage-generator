/*global $*/
/*global Generator*/
/*global Recipients*/
/*global processedDocuments*/


const RecipientsModal = {
    /**
     * @type {Recipient[]}
     */
    availableRecipients: [],
    /**
     * @type {Recipient[]}
     */
    selectedRecipients: []
};

RecipientsModal.configureFor = (fileName) => {
    RecipientsModal.fileName = fileName;
}

RecipientsModal.show = () => {
    RecipientsModal.availableRecipients = Recipients.getAllRecipients();
    RecipientsModal.selectedRecipients = [];
    RecipientsModal.renderAvailableAndSelected();
    $('#add-recipients-modal').modal('show');
}

RecipientsModal.hide = () => {
    $('#add-recipients-modal').modal('hide');
}

RecipientsModal.renderAvailableAndSelected = () => {
    RecipientsModal.renderAvailableRecipients();
    RecipientsModal.renderSelectedRecipients();
}

RecipientsModal.renderAvailableRecipients = (filterValue) => {
    $('#available-recipients').empty();

    const recipientsToRender = RecipientsModal.availableRecipients.filter((recipient) => {
        return !RecipientsModal.selectedRecipients.some((selected) => selected.name === recipient.name);
    })
        .filter((recipient) => {
            if (!filterValue) {
                return true;
            }
            try {
                return recipient.name.toLowerCase().includes(filterValue);
            } catch {
                return true;
            }
        })

    recipientsToRender.forEach((recipient) => {
        const entryHtml = `<div class="border border-primary border-2 mt-1">
        <p>${recipient.name}</p>
        <p>${recipient.address}</p>
        <button class="btn btn-success" onclick="RecipientsModal.onAddRecipientClick('${recipient.name}')">Dodaj</button>
        </div>
        `
        $('#available-recipients').append(entryHtml);
    });
}

RecipientsModal.renderSelectedRecipients = () => {
    $('#selected-recipients').empty();

    RecipientsModal.selectedRecipients.forEach((recipient, index) => {
        const entryHtml = `<div class="border border-primary border-2 mt-1">
        <p>${recipient.name}</p>
        <p>${recipient.address}</p>
        <button class="btn btn-danger" onclick="RecipientsModal.onDeleteRecipientClick(${index})">Usuń</button>
        </div>
        `
        $('#selected-recipients').append(entryHtml);
    });
}

RecipientsModal.onAddRecipientClick = (recipientName) => {
    const recipient = Recipients.getByName(recipientName);
    RecipientsModal.selectedRecipients.push(recipient);
    RecipientsModal.renderAvailableAndSelected();
};

RecipientsModal.onDeleteRecipientClick = (recipientIndex) => {
    RecipientsModal.selectedRecipients.splice(recipientIndex, 1);
    RecipientsModal.renderAvailableAndSelected();
}

RecipientsModal.onSaveClick = () => {
    const document = processedDocuments.find((document) => document.fileName === RecipientsModal.fileName);
    document.recipients.push(...RecipientsModal.selectedRecipients);
    Generator.renderProcessingSummary();
    RecipientsModal.hide();
}

RecipientsModal.onFilterInputChange = () => {
    const filterValue = $('#add-recipient-modal-filter-input').val().trim();
    RecipientsModal.renderAvailableRecipients(filterValue.toLowerCase());
};