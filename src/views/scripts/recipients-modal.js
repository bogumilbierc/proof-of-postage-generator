/*global $*/
/*global Generator*/
/*global Recipients*/
/*global processedDocuments*/


const RecipientsModal = {};

RecipientsModal.configureFor = (fileName) => {
    RecipientsModal.fileName = fileName;
}

RecipientsModal.show = () => {
    RecipientsModal.renderAvailableRecipients();
    $('#add-recipients-modal').modal('show');
}

RecipientsModal.hide = () => {
    $('#add-recipients-modal').modal('hide');
}

RecipientsModal.renderAvailableRecipients = () => {
    $('#available-recipients').empty();

    const recipients = Recipients.getAllRecipients();
    console.debug('Got recipient for modal');
    console.debug(recipients);

    recipients.forEach((recipient) => {

        const entryHtml = `<div class="border border-primary border-2 mt-1">
        <p>${recipient.name}</p>
        <p>${recipient.address}</p>
        <button class="btn btn-success" onclick="RecipientsModal.onAddRecipientClick('${recipient.name}')">Dodaj</button>
        </div>
        `
        console.debug(`Appending HTML: ${entryHtml}`);
        $('#available-recipients').append(entryHtml);

    });
}

RecipientsModal.onAddRecipientClick = (recipientName) => {

    const document = processedDocuments.find((document) => document.fileName === RecipientsModal.fileName);
    const recipient = Recipients.getByName(recipientName);
    document.recipients.push(recipient);
    Generator.renderProcessingSummary();

};