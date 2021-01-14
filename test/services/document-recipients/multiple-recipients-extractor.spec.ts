
import { Recipient } from '../../../src/models/recipient.model';
import { AddressLinesExtractor } from '../../../src/services/document-recipients/address-lines-extractor';
import { AddressRefiner } from '../../../src/services/document-recipients/address-refiner';
import { MultipleRecipientsExtractor } from '../../../src/services/document-recipients/multiple-recipients-extractor';


describe('MultipleRecipientsExtractor', () => {

    const addressLinesExtractor = new AddressLinesExtractor();
    const addressRefiner = new AddressRefiner();
    const recipientsExtractor = new MultipleRecipientsExtractor(addressLinesExtractor, addressRefiner);

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
            },
            {
                address: [
                    "Jan Kowalski",
                    "ul.Kasztanowa 7, 10-200 Zawady",
                ],
            }
        ];
        expect(recipientsExtractor.extractRecipients(documentText)).toEqual(expected);
    });

    it('should properly extract multiple recipients, with sections, numeration, representants', () => {
        const documentText = [
            'Warszawa, 19 sierpnia 2019r.',
            'Sąd Okręgowy w Warszawie',
            'XVI Wydział Gospodarczy',
            'ul. Czerniakowska 100',
            '00-454 Warszawa',
            'Powód:',
            '1.Jan Topczewski',
            'ul. Brzozowa 42,05-230 Przewalanka',
            'PESEL 21230509856',
            '2. Anna Topczewska',
            'ul. Brzozowa 42,05-230 Przewalanka',
            'PESEL45672507225',
            '3. Robert Topczewski',
            'ul. Brzozowa 42,11-200 Przewalanka',
            'PESEL 12120605398',
            'prowadzący działalność gospodarczą w',
            'formie spółki cywilnej',
            'TOP-TIP Topczewski s.c. Borys',
            'Topczewski, Danuta Topczewska, Rysiek',
            'Topczewski, NlP 1230021115',
            'z siedzibą ul. Brzozowa 42,05-230 Przewalanka',
            'reprezentowany przez',
            'radcę prawnego Annę Spam-Spamer',
            'adres do doreczeń:',
            'Kancelaria Radcy Prawnego',
            'ul. Odrzutowa 8 / 42, 13-984 Warszawa',
            'Pozwani:  .',
            '1) Przewalanka Dom Sp. z o.o.',
            'ul. Warszawska 14A, 05-230 Przewalanka',
            'KRS nr 1110603992, NlP 3331638568',
            '(adres w aktach sprawy)',
            'Reprezentowana przez:',
            'Radcę Prawnego Artura Bierć',
            'Bierć Kancelaria Radców Prawnych',
            'ul. Fabryczna 55',
            '05-270 Marki',
            '2| Przedsiębiorstwo Produkcyjno Testowe',
            'KATARYNKI Sp. z o.o.',
            'ul. K.Olszewskiego 8, 20-471 Grzędy'
        ].join('\n');

        const expected: Recipient[] = [
            {
                address: [
                    'Sąd Okręgowy w Warszawie',
                    'XVI Wydział Gospodarczy',
                    'ul. Czerniakowska 100',
                    '00-454 Warszawa',
                ],
            },
            {
                address: [
                    'Jan Topczewski',
                    'ul. Brzozowa 42,05-230 Przewalanka',
                ],
            },
            {
                address: [
                    'Anna Topczewska',
                    'ul. Brzozowa 42,05-230 Przewalanka',
                ],
            },
            {
                address: [
                    'Robert Topczewski',
                    'ul. Brzozowa 42,11-200 Przewalanka',
                ],
            },
            {
                address: [
                    'prowadzący działalność gospodarczą w',
                    'formie spółki cywilnej',
                    'TOP-TIP Topczewski s.c. Borys',
                    'Topczewski, Danuta Topczewska, Rysiek',
                    'Topczewski, NlP 1230021115',
                    'z siedzibą ul. Brzozowa 42,05-230 Przewalanka',
                ],
            },
            {
                address: [
                    'Kancelaria Radcy Prawnego',
                    'ul. Odrzutowa 8 / 42, 13-984 Warszawa',
                ],
            },
            {
                address: [
                    'Przewalanka Dom Sp. z o.o.',
                    'ul. Warszawska 14A, 05-230 Przewalanka',
                ],
            },
            {
                address: [
                    'Radcę Prawnego Artura Bierć',
                    'Bierć Kancelaria Radców Prawnych',
                    'ul. Fabryczna 55',
                    '05-270 Marki',
                ],
            },
            {
                address: [
                    'Przedsiębiorstwo Produkcyjno Testowe',
                    'KATARYNKI Sp. z o.o.',
                    'ul. K.Olszewskiego 8, 20-471 Grzędy'
                ],
            }
        ];

        expect(recipientsExtractor.extractRecipients(documentText)).toEqual(expected);
    })

});