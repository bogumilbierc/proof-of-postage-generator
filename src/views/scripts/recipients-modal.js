/*global $*/
/*global Recipients*/


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
        <button class="btn btn-success">Dodaj</button>
        </div>
        `
        console.debug(`Appending HTML: ${entryHtml}`);
        $('#available-recipients').append(entryHtml);

    });
}