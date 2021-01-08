import { dialog } from 'electron'
import { RecipientExtractor } from './recipient-extractor';
const mammoth = require('mammoth');

export class DocumentProcessor {

    static readonly HEADER_LENGTH_LIMIT = 500;
    static readonly POSTCODE_CITY_REGEX = /^\d{2}-\d{3} \D{3,}$/;
    static readonly CITY_DATE_START_REGEX = /^\D{3,}, dnia/;
    static readonly CITY_DATE_END_REGEX = /(\d{4} roku)|(\d{4} r.)/;

    constructor(private readonly recipientExtractor: RecipientExtractor) { }

    async openAndProcessDocument(): Promise<void> {
        const fileNames = dialog.showOpenDialogSync({ properties: ['openFile'] });
        if (fileNames?.length) {
            this.processDocument(fileNames[0]);
        }
    }

    async processDocument(path: string): Promise<string[]> {
        console.log(`Will try to process document at path: ${path}`);
        const document = await mammoth.extractRawText({ path });
        return this.recipientExtractor.extractRecipient(document?.value);
    }

}