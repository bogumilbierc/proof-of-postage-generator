import { dialog } from 'electron';
import * as log from 'electron-log';
import * as path from 'path';
import { ProcessDocumentsRequest } from '../../models/process-documents-request.model';
import { ProcessedDocument } from '../../models/processed-document.model';
import { MultipleRecipientsExtractor } from './multiple-recipients-extractor';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mammoth = require('mammoth');

export class DocumentProcessor {

    static readonly SUPPORTED_EXTENSIONS = ['doc', 'docx', 'odt'];

    constructor(private readonly multipleRecipientsExtractor: MultipleRecipientsExtractor) { }

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

    private async processSingleDocument(documentPath: string): Promise<ProcessedDocument> {
        log.debug(`Will try to process document at path: ${documentPath}`);
        const fileName = path.parse(documentPath).name;
        if (!this.isDocumentTypeSupported(documentPath)) {
            log.error(`Unsupported extension at path: ${documentPath}`);
            return Promise.resolve({
                path: documentPath,
                success: false,
                message: `FileType unsupported. Supported file types are: ${JSON.stringify(DocumentProcessor.SUPPORTED_EXTENSIONS)}`
            })
        }

        try {
            const document = await mammoth.extractRawText({ path: documentPath });
            const recipients = this.multipleRecipientsExtractor.extractRecipients(document?.value);

            return {
                fileName,
                path: documentPath,
                recipients,
                success: recipients?.length > 0
            }
        } catch (e) {
            log.error(`Error while processing at path: ${documentPath}`);
            log.error(e);
            return {
                fileName,
                path: documentPath,
                success: false,
                message: e?.message
            }
        }

    }

    private isDocumentTypeSupported(path: string): boolean {
        return !!DocumentProcessor.SUPPORTED_EXTENSIONS.find((extension: string) => path.toLowerCase().endsWith(extension.toLowerCase()));
    }

}