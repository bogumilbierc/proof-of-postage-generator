import { dialog } from 'electron';
import { ProcessDocumentsRequest } from '../models/process-documents-request.model';
import { ProcessedDocument } from '../models/process-documents-response.model';
import { RecipientExtractor } from './recipient-extractor';
const mammoth = require('mammoth');

export class DocumentProcessor {

    static readonly HEADER_LENGTH_LIMIT = 500;
    static readonly POSTCODE_CITY_REGEX = /^\d{2}-\d{3} \D{3,}$/;
    static readonly CITY_DATE_START_REGEX = /^\D{3,}, dnia/;
    static readonly CITY_DATE_END_REGEX = /(\d{4} roku)|(\d{4} r.)/;

    constructor(private readonly recipientExtractor: RecipientExtractor) { }

    async openAndProcessDocument(request: ProcessDocumentsRequest): Promise<ProcessedDocument> {
        const fileNames = request.paths || this.promptForPaths();
        if (fileNames?.length) {
            return this.processSingleDocument(fileNames[0]);
        }
        return Promise.resolve({ path: 'test' });
    }

    private promptForPaths(): string[] {
        return dialog.showOpenDialogSync({
            properties: ['openFile'],
            filters: [
                {
                    name: 'Pisma',
                    extensions: ['doc', 'docx', 'pdf', 'odt']
                }
            ]
        });
    }

    private async processSingleDocument(path: string): Promise<ProcessedDocument> {
        console.log(`Will try to process document at path: ${path}`);
        const document = await mammoth.extractRawText({ path });
        const recipient = this.recipientExtractor.extractRecipient(document?.value);
        return {
            path,
            recipient
        }
    }

}