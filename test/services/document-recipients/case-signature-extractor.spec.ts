import { CaseSignatureExtractor } from "../../../src/services/document-recipients/case-signature-extractor";


describe('CaseSignatureExtractor', () => {

    const extractor = new CaseSignatureExtractor();

    it('should return null for null input', () => {
        expect(extractor.extractCaseSignature(null)).toBeNull();
    })

    it('should return null for empty input', () => {
        expect(extractor.extractCaseSignature(' ')).toBeNull();
    })

    it('should return case signature if found in text', () => {
        const documentText = '"Warszawa, dnia 01.10.2019 roku\n\n\n\nSąd Apelacyjny w Warszawie\n\nVI Wydział Cywilny \n\npl. Krasińskich 2/4/6\n\n00-207 Warszawa\n\n\n\nPowodowie:\nJan Kowalski\n\nreprezentowani przez adw. Adam Kowalaskiego\n\nul.Jedwabna 12, 0-100 Kraków\n\njakis test\n\n\n\n\ntest\nsiedem\nosiem\nSygn. akt: Blah blah\n'
        expect(extractor.extractCaseSignature(documentText)).toEqual('Blah blah');
    });

});