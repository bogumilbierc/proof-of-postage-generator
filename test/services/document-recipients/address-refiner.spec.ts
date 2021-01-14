import { Recipient } from "../../../src/models/recipient.model";
import { AddressRefiner } from "../../../src/services/document-recipients/address-refiner";

describe('AddressRefiner', () => {
    const refiner = new AddressRefiner();

    it('should return same address if it does not need refinement', () => {
        const recipient: Recipient = {
            address: [
                'Sąd Okręgowy w Warszawie',
                'XVI Wydział Gospodarczy',
                'ul. Czerniakowska 100',
                '00-454 Warszawa',
            ],
        };

        expect(refiner.refineRecipientAddress(recipient)).toEqual(recipient);
    });

    it('should remove punctuation (dot without space) from address if present in first line', () => {
        const recipient: Recipient = {
            address: [
                '1.Jan Topczewski',
                'ul. Brzozowa 42,05-230 Przewalanka',
            ],
        };

        const expected: Recipient = {
            address: [
                'Jan Topczewski',
                'ul. Brzozowa 42,05-230 Przewalanka',
            ],
        };

        expect(refiner.refineRecipientAddress(recipient)).toEqual(expected);
    });

    it('should remove punctuation (dot with space) from address if present in first line', () => {
        const recipient: Recipient = {
            address: [
                '1. Jan Topczewski',
                'ul. Brzozowa 42,05-230 Przewalanka',
            ],
        };

        const expected: Recipient = {
            address: [
                'Jan Topczewski',
                'ul. Brzozowa 42,05-230 Przewalanka',
            ],
        };

        expect(refiner.refineRecipientAddress(recipient)).toEqual(expected);
    });

    it('should remove punctuation (pipe with space) from address if present in first line', () => {
        const recipient: Recipient = {
            address: [
                '1| Jan Topczewski',
                'ul. Brzozowa 42,05-230 Przewalanka',
            ],
        };

        const expected: Recipient = {
            address: [
                'Jan Topczewski',
                'ul. Brzozowa 42,05-230 Przewalanka',
            ],
        };

        expect(refiner.refineRecipientAddress(recipient)).toEqual(expected);
    });

    it('should remove punctuation (parenthesis without space) from address if present in first line', () => {
        const recipient: Recipient = {
            address: [
                '1)Jan Topczewski',
                'ul. Brzozowa 42,05-230 Przewalanka',
            ],
        };

        const expected: Recipient = {
            address: [
                'Jan Topczewski',
                'ul. Brzozowa 42,05-230 Przewalanka',
            ],
        };

        expect(refiner.refineRecipientAddress(recipient)).toEqual(expected);
    });
});
