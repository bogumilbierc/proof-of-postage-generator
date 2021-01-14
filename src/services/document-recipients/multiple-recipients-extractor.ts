import * as log from 'electron-log';
import { Recipient } from "../../models/recipient.model";
import { AddressLineUtils } from './address-line-utils';
import { AddressLinesExtractor } from './address-lines-extractor';
import { AddressRefiner } from './address-refiner';

export class MultipleRecipientsExtractor {

    constructor(
        private readonly addressLinesExtractor: AddressLinesExtractor,
        private readonly addressRefiner: AddressRefiner) {

    }

    extractRecipients(documentText: string): Recipient[] {
        if (!documentText) {
            return [];
        }

        const linesWithPotentialAddresses = this.addressLinesExtractor.extractLinesWithPotentialAddresses(documentText);

        log.debug('MultipleRecipientsExtractor: Lines with potential addresses:');
        log.debug(linesWithPotentialAddresses);

        const recipients = this.splitAddressLinesIntoRecipients(linesWithPotentialAddresses);
        log.debug('MultipleRecipientsExtractor: Recipients');
        log.debug(recipients);

        const validRecipients = recipients
            .filter((recipient: Recipient): boolean => {
                return this.hasValidAddress(recipient);
            });

        log.debug('MultipleRecipientsExtractor: Valid Recipients');
        log.debug(recipients);

        const refinedRecipients = validRecipients.map((recipient: Recipient) => this.addressRefiner.refineRecipientAddress(recipient));

        log.debug('MultipleRecipientsExtractor: Refined Recipients');
        log.debug(refinedRecipients);

        return refinedRecipients;
    }

    private splitAddressLinesIntoRecipients(addressLines: string[]): Recipient[] {

        if (!addressLines || !addressLines.length) {
            return [];
        }

        const recipients: Recipient[] = [];
        let currentRecipient: Recipient = { address: [] };

        addressLines.forEach((line: string) => {

            if (AddressLineUtils.isBeginningOfNewGroupOfRecipients(line)) {
                recipients.push({
                    ...currentRecipient
                });
                currentRecipient = { address: [] }
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
        const hasAddressLines = recipient.address?.find((addressLine: string): boolean => {
            return AddressLineUtils.isPostcodeLine(addressLine);
        });
        return hasAddressLines && recipient?.address?.length >= 2;
    }

}