import * as log from 'electron-log';
import { Recipient } from "../models/recipient.model";
import { AddressLineUtils } from './address-line-utils';
import { AddressLinesExtractor } from './address-lines-extractor';

export class MultipleRecipientsExtractor {

    constructor(private readonly addressLinesExtractor: AddressLinesExtractor) {

    }

    extractRecipients(documentText: string): Recipient[] {
        if (!documentText) {
            return [];
        }

        const linesWithPotentialAddresses = this.addressLinesExtractor.extractLinesWithPotentialAddresses(documentText);

        log.info('MultipleRecipientsExtractor: Lines with potential addresses:');
        log.info(linesWithPotentialAddresses);

        const recipients = this.splitAddressLinesIntoRecipients(linesWithPotentialAddresses);
        log.info('MultipleRecipientsExtractor: Recipients');
        log.info(recipients);

        return [];
    }

    private splitAddressLinesIntoRecipients(addressLines: string[]): Recipient[] {

        if (!addressLines || !addressLines.length) {
            return [];
        }

        const recipients: Recipient[] = [];
        let currentRecipient: Recipient = { address: [] };

        addressLines.forEach((line: string) => {
            if (!currentRecipient.name) {
                currentRecipient.name = line;
            }
            currentRecipient.address.push(line);
            if (AddressLineUtils.isPostcodeLine(line)) {
                recipients.push({
                    ...currentRecipient
                });
                currentRecipient = { address: [] }
            }
        });

        return recipients;

    }

    private hasValidAddress(recipient: Recipient): boolean {
        // check if address has valid postcode and at least two lines
        return true;
    }

}