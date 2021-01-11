import * as log from 'electron-log';
import * as path from 'path';
import { ProcessDocumentsRequest } from "../models/process-documents-request.model";
import { ProcessedDocument } from "../models/processed-document.model";
import { DocumentProcessor } from "./document-processor";
import { PdfGenerator } from "./pdf-generator";
import { PreferencesService } from './preferences-service';
import { SenderStore } from "./sender-store";
import fs = require('fs');

export class ProofOfPostageService {

    constructor(
        private readonly documentProcessor: DocumentProcessor,
        private readonly pdfGenerator: PdfGenerator,
        private readonly sendersStore: SenderStore,
        private readonly preferencesService: PreferencesService) {

    }

    async processRequest(request: ProcessDocumentsRequest): Promise<ProcessedDocument[]> {
        log.debug(`ProofOfPostageService: Processing request: ${JSON.stringify(request)}`);
        const sender = this.sendersStore.getSender(request.sender);
        log.debug(`ProofOfPostageService: Got sender details: ${JSON.stringify(sender)}`);
        const processedDocuments: ProcessedDocument[] = await this.documentProcessor.processRequest(request);
        log.debug(`ProofOfPostageService: Documents processed: ${JSON.stringify(processedDocuments)}`);

        for (let document of processedDocuments) {
            if (document.success) {
                const confirmationPath = this.getConfirmationFilePath(document)
                document.confirmationLocation = confirmationPath;
                document.pdfGenerated = await this.pdfGenerator.safelyGenerateFile(sender, document.recipient, confirmationPath);
            } else {
                document.pdfGenerated = false;
            }
        }
        log.debug(`ProofOfPostageService: All documents processed`);
        return processedDocuments;
    }

    private getConfirmationFilePath(document: ProcessedDocument): string {
        const filename = path.parse(document.path).name;
        return path.join(
            this.getConfirmationsFolderLocation(),
            `${filename}_potwierdzenie.pdf`
        );
    }

    private getConfirmationsFolderLocation(): string {
        const rootConfirmationsFolder = this.preferencesService.getUserPreferences().confirmationsLocation;
        const date = new Date();
        const day = `${date.getDay()}`.padStart(2, '0');
        const month = `${date.getMonth()}`.padStart(2, '0');
        const year = date.getFullYear();
        const folderPath = path.join(
            rootConfirmationsFolder,
            `${year}_${month}_${day}`
        );
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }
        return folderPath;
    }
}