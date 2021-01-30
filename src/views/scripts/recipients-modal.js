/*global $*/


const RecipientsModal = {};

RecipientsModal.configureFor = (fileName) => {
    RecipientsModal.fileName = fileName;
}

RecipientsModal.show = () => {
    $('#add-recipients-modal').modal('show');
}

RecipientsModal.hide = () => {
    $('#add-recipients-modal').modal('hide');
}