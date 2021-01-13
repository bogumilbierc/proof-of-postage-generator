import * as log from 'electron-log';


export class RecipientExtractor {

    static readonly HEADER_LENGTH_LIMIT = 500;
    static readonly POSTCODE_CITY_REGEX = /^\d{2}-\d{3} \D{3,}$/;
    static readonly CITY_DATE_START_REGEX = /^\D{3,}, dnia/;
    static readonly CITY_DATE_END_REGEX = /(\d{4} roku)|(\d{4} r.)/;

    extractRecipient(documentText: string): string[] {
        if (!documentText) {
            log.error('Document text is empty');
            return [];
        }
        log.debug('1. Get fragment of text, that possibly holds recipient');
        const possibleRecipientFragment = documentText?.substring(0, documentText.length > RecipientExtractor.HEADER_LENGTH_LIMIT ? RecipientExtractor.HEADER_LENGTH_LIMIT : documentText.length);
        log.debug('2. Extract top 10 lines from that fragment');
        const top10Lines = this.extractTop10Lines(possibleRecipientFragment);
        log.debug('3. Extract address lines from those 10 lines');
        const addressLines = this.extractAddressLines(top10Lines);
        log.debug('Adress lines');
        log.debug(addressLines);
        return addressLines;
    }

    private extractTop10Lines(text: string): string[] {
        const splitted = text?.split('\n');

        const nonEmptyLines = splitted?.filter((fragment: string) => !!fragment);
        if (nonEmptyLines?.length > 10) {
            nonEmptyLines.length = 10;
        }
        return nonEmptyLines;
    }

    private extractAddressLines(possibleAddressLines: string[]): string[] {
        const extractedAddressLines: string[] = [];

        for (let i = 0; i < possibleAddressLines.length; i++) {
            const currentLine = possibleAddressLines[i];

            if (this.isLineAddressLine(currentLine)) {
                extractedAddressLines.push(currentLine.trim());
            }
            if (this.isPostcodeLine(currentLine)) {
                break;
            }
        }

        return extractedAddressLines
            .filter((line) => line);
    }

    private isLineAddressLine(text: string): boolean {
        return !RecipientExtractor.CITY_DATE_START_REGEX.test(text) && !RecipientExtractor.CITY_DATE_END_REGEX.test(text);
    }

    private isPostcodeLine(text: string): boolean {
        return RecipientExtractor.POSTCODE_CITY_REGEX.test(text);
    }
}