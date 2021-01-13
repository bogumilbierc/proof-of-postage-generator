import * as log from 'electron-log';
import { Recipient } from "../models/recipient.model";
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

        return [];
    }

    private splitAddressLinesIntoRecipients(addressLines: string[]): Recipient[] {

        if (!addressLines || !addressLines.length) {
            return [];
        }

        const recipients: Recipient[] = [];
        let currentRecipient: Recipient = {};

        return recipients;

    }

    private hasValidAddress(recipient: Recipient): boolean {
        // check if address has valid postcode and at least two lines
        return true;
    }

}