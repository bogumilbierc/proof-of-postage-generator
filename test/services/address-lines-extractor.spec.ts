
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
        const documentText = '"Warszawa, dnia 01.10.2019 roku\n\n\n\nSąd Apelacyjny w Warszawie\n\nVI Wydział Cywilny \n\npl. Krasińskich 2/4/6\n\n00-207 Warszawa\n\n\n\nPowodowie:\n\Jan Kowalski\n\nreprezentowani przez adw. Adam Kowalaskiego\nul.Kasztanowa 7, 10-200 Zawady\nAdam Nowak\n\n\nul.Kasztanowa 27, 01-100 Sady\n';
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


});