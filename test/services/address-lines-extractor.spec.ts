
import { AddressLinesExtractor } from '../../src/services/address-lines-extractor';

describe('AddressLinesExtractor', () => {

    const service = new AddressLinesExtractor();

    it('should return empty array for null input', () => {
        expect(service.extractLinesWithPotentialAddresses(null)).toEqual([]);
    });

    it('should return empty array for empty input', () => {
        expect(service.extractLinesWithPotentialAddresses('')).toEqual([]);
    });

    it('should return lines with address for single recipient text', () => {
        const documentText = '"Warszawa, dnia 01.10.2019 roku\n\n\n\nSąd Apelacyjny w Warszawie\n\nVI Wydział Cywilny \n\npl. Krasińskich 2/4/6\n\n00-207 Warszawa\n\n\n\nPowodowie:\n\Jan Kowalski\n\nreprezentowani przez adw. Adam Kowalaskiego'
        const expected = [
            'Sąd Apelacyjny w Warszawie',
            'VI Wydział Cywilny',
            'pl. Krasińskich 2/4/6',
            '00-207 Warszawa'
        ]
        expect(service.extractLinesWithPotentialAddresses(documentText)).toEqual(expected);
    });

    it('should return lines with address for single recipients text (broken last recipient)', () => {
        const documentText = '"Warszawa, dnia 01.10.2019 roku\n\n\n\nSąd Apelacyjny w Warszawie\n\nVI Wydział Cywilny \n\npl. Krasińskich 2/4/6\n\n00-207 Warszawa\n\n\n\nPowodowie:\n\Jan Kowalski\n\nreprezentowani przez adw. Adam Kowalaskiego\n\nul.Jedwabna 12, 0-100 Kraków\n\njakis test\n\n\n\n\ntest\nsiedem\nosiem'
        const expected = [
            'Sąd Apelacyjny w Warszawie',
            'VI Wydział Cywilny',
            'pl. Krasińskich 2/4/6',
            '00-207 Warszawa'
        ]
        expect(service.extractLinesWithPotentialAddresses(documentText)).toEqual(expected);
    });

    it('should return lines with address for simple two recipients text', () => {
        const documentText = '"Warszawa, dnia 01.10.2019 roku\n\n\n\nSąd Apelacyjny w Warszawie\n\nVI Wydział Cywilny \n\npl. Krasińskich 2/4/6\n\n00-207 Warszawa\n\n\n\nPowodowie:\n\Jan Kowalski\n\nreprezentowani przez adw. Adam Kowalaskiego\nul.Kasztanowa 7, 10-200 Zawady';
        const expected = [
            'Sąd Apelacyjny w Warszawie',
            'VI Wydział Cywilny',
            'pl. Krasińskich 2/4/6',
            '00-207 Warszawa',
            "Powodowie:",
            "Jan Kowalski",
            "reprezentowani przez adw. Adam Kowalaskiego",
            "ul.Kasztanowa 7, 10-200 Zawady",
        ]
        expect(service.extractLinesWithPotentialAddresses(documentText)).toEqual(expected);
    });

    it('should return lines with address for simple three recipients text', () => {
        const documentText = '"Warszawa, 19 sierpnia 2019r.\n\n\n\nSąd Apelacyjny w Warszawie\n\nVI Wydział Cywilny \n\npl. Krasińskich 2/4/6\n\n00-207 Warszawa\n\n\n\nPowodowie:\n\Jan Kowalski\n\nreprezentowani przez adw. Adam Kowalaskiego\nul.Kasztanowa 7, 10-200 Zawady\nAdam Nowak\n\n\nul.Kasztanowa 27, 01-100 Sady\n';
        const expected = [
            'Sąd Apelacyjny w Warszawie',
            'VI Wydział Cywilny',
            'pl. Krasińskich 2/4/6',
            '00-207 Warszawa',
            "Powodowie:",
            "Jan Kowalski",
            "reprezentowani przez adw. Adam Kowalaskiego",
            "ul.Kasztanowa 7, 10-200 Zawady",
            "Adam Nowak",
            "ul.Kasztanowa 27, 01-100 Sady",
        ]
        expect(service.extractLinesWithPotentialAddresses(documentText)).toEqual(expected);
    });

    it('should return lines with address for multiple recipients without irrelevant lines', () => {
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

        const expected = [
            'Sąd Okręgowy w Warszawie',
            'XVI Wydział Gospodarczy',
            'ul. Czerniakowska 100',
            '00-454 Warszawa',
            '1.Jan Topczewski',
            'ul. Brzozowa 42,05-230 Przewalanka',
            '2. Anna Topczewska',
            'ul. Brzozowa 42,05-230 Przewalanka',
            '3. Robert Topczewski',
            'ul. Brzozowa 42,11-200 Przewalanka',
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
        ]

        expect(service.extractLinesWithPotentialAddresses(documentText)).toEqual(expected);
    });

});