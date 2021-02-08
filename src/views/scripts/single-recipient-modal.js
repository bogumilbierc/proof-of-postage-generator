/*global $*/
/*global Generator*/
/*global processedDocuments*/

const SingleRecipientModal = {

};

SingleRecipientModal.configureFor = (fileName) => {
    SingleRecipientModal.fileName = fileName;
}

SingleRecipientModal.show = () => {
    $('#add-single-recipient-ta').val('');
    $('#add-single-recipients-modal').modal('show');
}

SingleRecipientModal.hide = () => {
    $('#add-single-recipients-modal').modal('hide');
}

SingleRecipientModal.onSaveClick = () => {
    const recipientAddress = $('#add-single-recipient-ta').val().trim();
    if (!recipientAddress) {
        alert('Adres jest wymagany');
    }
    const document = processedDocuments.find((document) => document.fileName === SingleRecipientModal.fileName);
    document.recipients.push({
        address: recipientAddress.split('\n')
    });
    Generator.renderProcessingSummary();
    SingleRecipientModal.hide();
}