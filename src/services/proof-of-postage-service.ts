import * as log from 'electron-log';
import * as path from 'path';
import { GenerateConfirmationsRequest } from '../models/generate-confirmations-request.model';
import { ProcessedDocument } from "../models/processed-document.model";
import { PdfGenerator } from "./pdf-generator";
import { PreferencesService } from './preferences-service';
import { SenderStore } from "./sender-store";
import fs = require('fs');

export class ProofOfPostageService {

    constructor(
        private readonly pdfGenerator: PdfGenerator,
        private readonly sendersStore: SenderStore,
        private readonly preferencesService: PreferencesService) {

    }

    async processRequest(request: GenerateConfirmationsRequest): Promise<ProcessedDocument[]> {
        log.debug(`ProofOfPostageService: Processing request: ${JSON.stringify(request)}`);
        const sender = this.sendersStore.getSender(request.sender);
        log.debug(`ProofOfPostageService: Got sender details: ${JSON.stringify(sender)}`);

        const processedDocuments = request.documents;

        for (const document of processedDocuments) {
            document.fileName = path.parse(document.path).name;
            if (document?.recipients?.length) {
                const confirmationPath = this.getConfirmationFilePath(document.fileName)
                document.confirmationLocation = confirmationPath;
                document.pdfGenerated = await this.pdfGenerator.safelyGenerateFile(sender, document.recipients, confirmationPath);
            } else {
                log.debug(`Document: ${document.fileName} does not have recipients, skipping it`);
                document.pdfGenerated = false;
            }
        }
        log.debug(`ProofOfPostageService: All documents processed`);
        return processedDocuments;
    }

    private getConfirmationFilePath(filename: string): string {
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