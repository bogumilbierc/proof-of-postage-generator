import { RecipientExtractor } from '../../../src/services/document-recipients/recipient-extractor';

describe('RecipientExtractor', () => {

    const extractor = new RecipientExtractor();

    it('should return empty array for empty input', () => {
        expect(extractor.extractRecipient("")).toEqual([]);
    });

    it('should return empty array for null input', () => {
        expect(extractor.extractRecipient(null)).toEqual([]);
    });

    it('should properly extract address if header date has format "dd.MM.yyyy" and recipient name has two lines', () => {
        const documentText = '"Warszawa, dnia 01.10.2019 roku\n\n\n\nSąd Apelacyjny w Warszawie\n\nVI Wydział Cywilny \n\npl. Krasińskich 2/4/6\n\n00-207 Warszawa\n\n\n\nPowodowie:\n\Jan Kowalski\n\nreprezentowani przez adw. Adam Kowalaskiego'
        const expected = [
            'Sąd Apelacyjny w Warszawie',
            'VI Wydział Cywilny',
            'pl. Krasińskich 2/4/6',
            '00-207 Warszawa'
        ]
        expect(extractor.extractRecipient(documentText)).toEqual(expected);
    });
});