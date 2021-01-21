import * as log from 'electron-log';
import { Recipient } from '../models/recipient.model';
import { PreferencesService } from "./preferences-service";
import fs = require('fs');

export class RecipientStore {

    constructor(private readonly preferencesService: PreferencesService) {

    }

    addRecipient(recipient: Recipient): void {
        const recipients = this.getAllRecipients();
        recipients.push(recipient);
        this.storeRecipients(recipients);
    }

    deleteRecipient(name: string): void {
        const recipients = this.getAllRecipients();
        const filteredRecipients = recipients.filter(
            (recipient: Recipient) => recipient.name !== name
        );
        this.storeRecipients(filteredRecipients);
    }

    getAllRecipients(): Recipient[] {
        const recipientsLocation = this.preferencesService.getUserPreferences().recipientsStoreLocation;
        if (!fs.existsSync(recipientsLocation)) {
            log.info('Recipients file does not exist. Returning empty list of recipients');
            return [];
        }
        const rawFile = fs.readFileSync(recipientsLocation);
        return JSON.parse(rawFile.toString());
    }

    getRecipient(name: string): Recipient {
        const recipients = this.getAllRecipients();
        const recipient = recipients.find((recipient: Recipient) => recipient.name === name);
        return recipient;
    }

    private storeRecipients(recipients: Recipient[]): void {
        const recipientsLocation = this.preferencesService.getUserPreferences().recipientsStoreLocation;
        log.debug(`Storing list of recipients in: ${recipientsLocation}`);
        fs.writeFileSync(recipientsLocation, JSON.stringify(recipients));
        log.info(`Stored list of recipients in: ${recipientsLocation}`);
    }

}
