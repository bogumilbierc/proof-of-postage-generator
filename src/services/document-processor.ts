import { dialog } from 'electron';
import * as log from 'electron-log';
import { ProcessDocumentsRequest } from '../models/process-documents-request.model';
import { ProcessedDocument } from '../models/processed-document.model';
import { MultipleRecipientsExtractor } from './multiple-recipients-extractor';
import { RecipientExtractor } from './recipient-extractor';
const mammoth = require('mammoth');

export class DocumentProcessor {

    static readonly SUPPORTED_EXTENSIONS = ['doc', 'docx', 'odt'];

    constructor(private readonly recipientExtractor: RecipientExtractor) { }

    async processRequest(request: ProcessDocumentsRequest): Promise<ProcessedDocument[]> {
        const fileNames = request.paths || this.promptForPaths();
        if (fileNames?.length) {
            const promises = fileNames.map((path: string) => this.processSingleDocument(path));
            return Promise.all(promises);
        }
        return Promise.resolve([]);
    }

    private promptForPaths(): string[] {
        return dialog.showOpenDialogSync({
            properties: [
                'openFile',
                'multiSelections'
            ],
            filters: [
                {
                    name: 'Pisma',
                    extensions: DocumentProcessor.SUPPORTED_EXTENSIONS
                }
            ]
        });
    }

    private async processSingleDocument(path: string): Promise<ProcessedDocument> {
        log.debug(`Will try to process document at path: ${path}`);

        if (!this.isDocumentTypeSupported(path)) {
            log.error(`Unsupported extension at path: ${path}`);
            return Promise.resolve({
                path,
                success: false,
                message: `FileType unsupported. Supported file types are: ${JSON.stringify(DocumentProcessor.SUPPORTED_EXTENSIONS)}`
            })
        }
        try {
            const document = await mammoth.extractRawText({ path });
            const recipient = this.recipientExtractor.extractRecipient(document?.value);
            new MultipleRecipientsExtractor().extractRecipients(document?.value);
            return {
                path,
                recipient,
                success: recipient?.length > 0
            }
        } catch (e) {
            log.error(`Error while processing at path: ${path}`);
            log.error(e);
            return {
                path,
                success: false,
                message: e?.message
            }
        }

    }

    private isDocumentTypeSupported(path: string): boolean {
        return !!DocumentProcessor.SUPPORTED_EXTENSIONS.find((extension: string) => path.toLowerCase().endsWith(extension.toLowerCase()));
    }

}