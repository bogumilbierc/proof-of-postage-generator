
import { Recipient } from '../../../src/models/recipient.model';
import { AddressLinesExtractor } from '../../../src/services/document-recipients/address-lines-extractor';
import { MultipleRecipientsExtractor } from '../../../src/services/document-recipients/multiple-recipients-extractor';


describe('MultipleRecipientsExtractor', () => {

    const addressLinesExtractor = new AddressLinesExtractor();
    const recipientsExtractor = new MultipleRecipientsExtractor(addressLinesExtractor);

    it('should properly extract single recipient', () => {
        const documentText = '"Warszawa, dnia 01.10.2019 roku\n\n\n\nSąd Apelacyjny w Warszawie\n\nVI Wydział Cywilny \n\npl. Krasińskich 2/4/6\n\n00-207 Warszawa\n\n\n\nPowodowie:\n\nJan Kowalski\n\nreprezentowani przez adw. Adam Kowalaskiego'
        const expected: Recipient[] = [
            {
                address: [
                    'Sąd Apelacyjny w Warszawie',
                    'VI Wydział Cywilny',
                    'pl. Krasińskich 2/4/6',
                    '00-207 Warszawa'
                ],
                name: "Sąd Apelacyjny w Warszawie"
            }
        ];

        expect(recipientsExtractor.extractRecipients(documentText)).toEqual(expected);
    });

    it('should properly extract two recipients (easy case)', () => {
        const documentText = '"Warszawa, dnia 01.10.2019 roku\n\n\n\nSąd Apelacyjny w Warszawie\n\nVI Wydział Cywilny \n\npl. Krasińskich 2/4/6\n\n00-207 Warszawa\n\n\n\nPowodowie:\n\nJan Kowalski\n\n\nul.Kasztanowa 7, 10-200 Zawady';
        const expected: Recipient[] = [
            {
                address: [
                    'Sąd Apelacyjny w Warszawie',
                    'VI Wydział Cywilny',
                    'pl. Krasińskich 2/4/6',
                    '00-207 Warszawa',
                ],
                name: 'Sąd Apelacyjny w Warszawie'
            },
            {
                address: [
                    "Jan Kowalski",
                    "ul.Kasztanowa 7, 10-200 Zawady",
                ],
                name: "Jan Kowalski"
            }
        ];
        expect(recipientsExtractor.extractRecipients(documentText)).toEqual(expected);
    })

});