import { RecipientExtractor } from '../../src/services/recipient-extractor';

describe('RecipientExtractor', () => {

    const extractor = new RecipientExtractor();

    it('should return empty array for empty input', () => {
        expect(extractor.extractRecipient("")).toEqual([]);
    });

    it('should return empty array for null input', () => {
        expect(extractor.extractRecipient(null)).toEqual([]);
    });

    // it('should properly extract address', () => {
    //     fail('not done yet');
    // })
});