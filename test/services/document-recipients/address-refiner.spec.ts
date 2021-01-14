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

    it('should choose delivery address (delivery address header has no additional content)', () => {
        const recipient: Recipient = {
            address: [
                'reprezentowany przez',
                'radcę prawnego Annę Spam-Spamer',
                'adres do doreczeń:',
                'Kancelaria Radcy Prawnego',
                'ul. Odrzutowa 8 / 42, 13-984 Warszawa',
            ],
        };

        const expected: Recipient = {
            address: [
                'Kancelaria Radcy Prawnego',
                'ul. Odrzutowa 8 / 42, 13-984 Warszawa',
            ]
        };

        expect(refiner.refineRecipientAddress(recipient)).toEqual(expected);
    });

    it('should choose delivery address (delivery address header has actual content as well)', () => {
        const recipient: Recipient = {
            address: [
                'reprezentowany przez',
                'radcę prawnego Annę Spam-Spamer',
                'Adres Do Doreczeń:Kancelaria Radcy Prawnego',
                'ul. Odrzutowa 8 / 42, 13-984 Warszawa',
            ],
        };

        const expected: Recipient = {
            address: [
                'Kancelaria Radcy Prawnego',
                'ul. Odrzutowa 8 / 42, 13-984 Warszawa',
            ]
        };

        expect(refiner.refineRecipientAddress(recipient)).toEqual(expected);
    });

    it('should choose representant', () => {
        const recipient: Recipient = {
            address: [
                'KRS nr 1110603992, NlP 3331638568',
                '(adres w aktach sprawy)',
                'Reprezentowana przez:',
                'Radcę Prawnego Artura Bierć',
                'Bierć Kancelaria Radców Prawnych',
                'ul. Fabryczna 55',
                '05-270 Marki',
            ],
        };

        const expected: Recipient = {
            address: [
                'Radcę Prawnego Artura Bierć',
                'Bierć Kancelaria Radców Prawnych',
                'ul. Fabryczna 55',
                '05-270 Marki',
            ]
        };

        expect(refiner.refineRecipientAddress(recipient)).toEqual(expected);
    });

    it('should choose representant (different regex)', () => {
        const recipient: Recipient = {
            address: [
                '',
                'Octa Okęcie Spółka z ograniczoną odpowiedzialnością Spółka komandytowa',
                'którą reprezentuje:',
                'r. pr. Artura Bierć',
                'Bierć Kancelaria Radców Prawnych',
                'ul. Fabryczna 55, 05-270 Marki'
            ]
        };

        const expected: Recipient = {
            address: [
                'r. pr. Artura Bierć',
                'Bierć Kancelaria Radców Prawnych',
                'ul. Fabryczna 55, 05-270 Marki'
            ]
        };

        expect(refiner.refineRecipientAddress(recipient)).toEqual(expected);
    });
});
